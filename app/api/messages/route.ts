import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Message from '@/models/message'
import User from '@/models/user'
import VerificationRequest from '@/models/VerificationRequest'

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string)
  }
}

// GET conversations list for current user
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(sessionCookie)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'list' for conversations, 'detail' for specific conversation

    await connectDB()

     if (type === 'unread-count') {
    const unreadConversations = await Message.aggregate([
      {
        $match: {
          recipientId: new mongoose.Types.ObjectId(sessionData.userId),
          isRead: false
        }
      },
      {
        $group: {
          _id: '$conversationId'
        }
      },
      {
        $count: 'total'
      }
    ])

    const unreadCount = unreadConversations.length > 0 ? unreadConversations[0].total : 0

    return NextResponse.json({
      success: true,
      unreadCount
    }, { status: 200 })
  }

    if (type === 'list') {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(sessionData.userId) },
            { recipientId: new mongoose.Types.ObjectId(sessionData.userId) }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          senderId: { $first: '$senderId' },
          recipientId: { $first: '$recipientId' },
          senderRole: { $first: '$senderRole' },
          pitchId: { $first: '$pitchId' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', new mongoose.Types.ObjectId(sessionData.userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ])

    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const otherUserId = msg.senderId.toString() === sessionData.userId ? msg.recipientId : msg.senderId
        const otherUser = await User.findById(otherUserId).select('firstName lastName email avatar role company')
        const pitch = await VerificationRequest.findById(msg.pitchId).select('pitchData')

        return {
          conversationId: msg._id,
          otherUser: {
            id: otherUserId,
            name: otherUser?.firstName + ' ' + otherUser?.lastName || 'Unknown',
            email: otherUser?.email,
            avatar: otherUser?.avatar,
            role: otherUser?.role,
             ...(otherUser?.role === 'entrepreneur' && { company: otherUser?.company })
          },
          pitch: {
            id: msg.pitchId,
            name: pitch?.pitchData?.startupName || 'Unnamed Pitch'
          },
          lastMessage: msg.lastMessage,
          lastMessageTime: msg.lastMessageTime,
          unreadCount: msg.unreadCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      conversations: enrichedMessages
    }, { status: 200 })
  } else if (type === 'detail') {
      // Get detailed conversation
      const conversationId = searchParams.get('conversationId')
      
      if (!conversationId) {
        return NextResponse.json(
          { success: false, error: 'Missing conversationId' },
          { status: 400 }
        )
      }

      const messages = await Message.find({ conversationId })
        .populate('senderId', 'firstName lastName email avatar')
        .populate('recipientId', 'firstName lastName email avatar')
        .populate('pitchId', 'pitchData')
        .sort({ createdAt: 1 })
        .lean()

      // Mark messages as read
      await Message.updateMany(
        {
          conversationId,
          recipientId: new mongoose.Types.ObjectId(sessionData.userId),
          isRead: false
        },
        { isRead: true }
      )

      return NextResponse.json({
        success: true,
        messages
      }, { status: 200 })
    }

  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST to send a message
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(sessionCookie)
    const { recipientId, pitchId, content, senderRole } = await request.json()

    if (!recipientId || !pitchId || !content || !senderRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Create conversation ID (consistent for both directions)
    const conversationId = [sessionData.userId, recipientId].sort().join('_')

    const message = await Message.create({
      conversationId,
      senderId: sessionData.userId,
      senderRole,
      recipientId,
      pitchId,
      content
    })

    const populatedMessage = await message.populate([
      { path: 'senderId', select: 'firstName lastName email avatar' },
      { path: 'recipientId', select: 'firstName lastName email avatar' }
    ])

    return NextResponse.json({
      success: true,
      message: populatedMessage
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle, XCircle, Video } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function AdminVerificationPage() {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showVideoDialog, setShowVideoDialog] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/verification-requests')
    const data = await res.json()
    setRequests(data.requests || [])
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/verification-requests/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      setNotification({ type: 'success', message: 'Request approved successfully!' })
      fetchRequests()
      setSelectedRequest(null)
      setTimeout(() => setNotification(null), 3000)
    } else {
      setNotification({ type: 'error', message: 'Failed to approve request' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      setNotification({ type: 'error', message: 'Please provide a rejection reason' })
      setTimeout(() => setNotification(null), 3000)
      return
    }
    
    const res = await fetch(`/api/verification-requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason })
    })
    
    if (res.ok) {
      setNotification({ type: 'success', message: 'Request rejected successfully!' })
      fetchRequests()
      setSelectedRequest(null)
      setShowRejectDialog(false)
      setRejectionReason('')
      setTimeout(() => setNotification(null), 3000)
    } else {
      setNotification({ type: 'error', message: 'Failed to reject request' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  if (loading) return (
    <div className="container py-8">
      <div className="text-center">Loading verification requests...</div>
    </div>
  )

  return (
    <div className="container py-8 max-w-7xl">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white animate-in slide-in-from-top`}>
          {notification.message}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2">Verification Requests</h1>
      <p className="text-gray-400 mb-6">Review and approve entrepreneur registration requests</p>
      
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-400">
              No pending verification requests
            </CardContent>
          </Card>
        ) : (
          requests.map((req: any) => (
            <Card key={req._id} className="border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{req.personalInfo.fullName}</CardTitle>
                    <p className="text-gray-400 mt-1">{req.personalInfo.businessName}</p>
                    {req.pitchData?.startupName && (
                      <p className="text-sm text-amber-500 mt-1">
                        Startup: {req.pitchData.startupName}
                      </p>
                    )}
                  </div>
                  <Badge variant={req.verificationStatus === 'pending' ? 'secondary' : 'default'}>
                    {req.verificationStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{req.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="font-medium">{req.personalInfo.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Industry</p>
                    <p className="font-medium">{req.personalInfo.industryType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="font-medium">{req.personalInfo.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Registration Number</p>
                    <p className="font-medium">{req.personalInfo.businessRegistrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Submitted</p>
                    <p className="font-medium">{new Date(req.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {req.pitchData?.oneLiner && (
                  <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Pitch One-liner:</p>
                    <p className="text-sm">{req.pitchData.oneLiner}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Documents Uploaded:</p>
                  <div className="flex flex-wrap gap-2">
                    {req.documents.required.map((doc: any, idx: number) => (
                      doc.fileCount > 0 && (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {doc.documentType} ({doc.fileCount})
                        </Badge>
                      )
                    ))}
                    {req.documents.optional.map((doc: any, idx: number) => (
                      doc.fileCount > 0 && (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {doc.documentType} ({doc.fileCount})
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {req.pitchData?.videoUrl && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(req)
                        setShowVideoDialog(true)
                      }}
                      className="border-amber-500/50 hover:bg-amber-500/10"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Watch Pitch
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedRequest(req)
                      setShowApproveDialog(true)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedRequest(req)
                      setShowRejectDialog(true)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pitch Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Pitch Video - {selectedRequest?.pitchData?.startupName}</DialogTitle>
          </DialogHeader>
          {selectedRequest?.pitchData && (
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden">
                <video 
                  src={selectedRequest.pitchData.videoUrl} 
                  controls 
                  className="w-full max-h-[500px]"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Startup Name</p>
                  <p className="font-medium">{selectedRequest.pitchData.startupName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Industry</p>
                  <p className="font-medium">{selectedRequest.pitchData.industry}</p>
                </div>
                <div>
                  <p className="text-gray-400">Stage</p>
                  <p className="font-medium capitalize">{selectedRequest.pitchData.stage}</p>
                </div>
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="font-medium">{selectedRequest.pitchData.location}</p>
                </div>
              </div>
              
              {selectedRequest.pitchData.oneLiner && (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">One-liner:</p>
                  <p>{selectedRequest.pitchData.oneLiner}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowVideoDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowVideoDialog(false)
                    setSelectedRequest(selectedRequest)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest && !showRejectDialog && !showVideoDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Pitch Information */}
              {selectedRequest.pitchData && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Video className="h-5 w-5 text-amber-500" />
                    Pitch Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-400">Startup Name</p>
                      <p className="font-medium">{selectedRequest.pitchData.startupName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Industry</p>
                      <p className="font-medium">{selectedRequest.pitchData.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stage</p>
                      <p className="font-medium capitalize">{selectedRequest.pitchData.stage}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="font-medium">{selectedRequest.pitchData.location}</p>
                    </div>
                  </div>
                  {selectedRequest.pitchData.oneLiner && (
                    <div className="p-3 bg-gray-900/50 rounded-lg mb-3">
                      <p className="text-sm text-gray-400 mb-1">One-liner:</p>
                      <p className="text-sm">{selectedRequest.pitchData.oneLiner}</p>
                    </div>
                  )}
                  {selectedRequest.pitchData.videoUrl && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideoDialog(true)}
                      className="w-full"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Watch Pitch Video
                    </Button>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Full Name</p>
                    <p className="font-medium">{selectedRequest.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Business Name</p>
                    <p className="font-medium">{selectedRequest.personalInfo.businessName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium">{selectedRequest.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Contact</p>
                    <p className="font-medium">{selectedRequest.personalInfo.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Registration Number</p>
                    <p className="font-medium">{selectedRequest.personalInfo.businessRegistrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Industry</p>
                    <p className="font-medium">{selectedRequest.personalInfo.industryType}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Required Documents</h3>
                <div className="space-y-2">
                    {selectedRequest.documents.required.map((doc: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-900 rounded">
                        <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="font-medium">{doc.documentType}</p>
                            <p className="text-sm text-gray-400">Files: {doc.fileCount}</p>
                        </div>
                        <Badge>{doc.status}</Badge>
                        </div>
                        {doc.fileUrls && doc.fileUrls.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {doc.fileUrls.map((url: string, fileIdx: number) => (
                            <div key={fileIdx} className="flex items-center gap-2">
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(url, '_blank')}
                                className="text-xs"
                                >
                                <Eye className="h-3 w-3 mr-1" />
                                View File {fileIdx + 1}
                                </Button>
                                <span className="text-xs text-gray-400 truncate max-w-xs">
                                {url.split('/').pop()}
                                </span>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    ))}
                </div>
              </div>

                {selectedRequest.documents.optional.some((doc: any) => doc.fileCount > 0) && (
                <div>
                    <h3 className="font-semibold mb-3">Optional Documents</h3>
                    <div className="space-y-2">
                    {selectedRequest.documents.optional.map((doc: any, idx: number) => (
                        doc.fileCount > 0 && (
                        <div key={idx} className="p-3 bg-gray-900 rounded">
                            <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="font-medium">{doc.documentType}</p>
                                <p className="text-sm text-gray-400">Files: {doc.fileCount}</p>
                            </div>
                            <Badge>{doc.status}</Badge>
                            </div>
                            {doc.fileUrls && doc.fileUrls.length > 0 && (
                            <div className="space-y-2 mt-3">
                                {doc.fileUrls.map((url: string, fileIdx: number) => (
                                <div key={fileIdx} className="flex items-center gap-2">
                                    <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(url, '_blank')}
                                    className="text-xs"
                                    >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View File {fileIdx + 1}
                                    </Button>
                                    <span className="text-xs text-gray-400 truncate max-w-xs">
                                    {url.split('/').pop()}
                                    </span>
                                </div>
                                ))}
                            </div>
                            )}
                        </div>
                        )
                    ))}
                    </div>
                </div>
                )}
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setShowApproveDialog(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </Button>
                <Button 
                  className="flex-1"
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rejection Reason</label>
              <Textarea 
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason('')
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => selectedRequest && handleReject(selectedRequest._id)}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Approve Confirmation Dialog */}
      <Dialog open={!!selectedRequest && showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">Are you sure you want to approve this verification request?</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => {
              selectedRequest && handleApprove(selectedRequest._id)
              setShowApproveDialog(false)
            }}>
              Confirm Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
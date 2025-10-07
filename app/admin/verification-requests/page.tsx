'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle, XCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
// Assuming this import path is correct for your session hook:
import { useAppSession } from '@/hooks/use-app-session' 

export default function AdminVerificationPage() {
  // --- Session State ---
  const { session, isLoading: sessionLoading } = useAppSession();
  const adminId = session?.user?.id; // <-- FIXED: Safely extract the adminId
  const isAdmin = session?.user?.role === 'admin';

  // --- Local Component State ---
  const [requests, setRequests] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true) // Renamed for clarity
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Only attempt to fetch data after the session has finished loading
    if (!sessionLoading) {
        if (adminId && isAdmin) {
            fetchRequests(adminId);
        } else {
            // If session loaded but user is not authorized, stop the loading spinner
            setDataLoading(false);
        }
    }
  }, [sessionLoading, adminId, isAdmin]) // Dependency array now correctly tracks session state

  const fetchRequests = async (adminId: string) => {
    setDataLoading(true); // Start data loading
    try {
      const res = await fetch('/api/admin/verification-requests')
      
      if (!res.ok) {
        // Log non-200 responses for better debugging
        console.error(`Failed to fetch requests: ${res.status} ${res.statusText}`);
        throw new Error('API request failed');
      }

      const data = await res.json()
      setRequests(data.requests || [])
    } catch(error) {
        console.error('Error fetching verification requests:', error);
        setRequests([]); // Clear requests on failure
    } finally {
      setDataLoading(false) // Stop data loading
    }
  }

  // --- Action Handlers ---

  const handleApprove = async (id: string) => {
    if (!adminId) {
        alert('Authentication Error: Admin ID is missing. Please log in.');
        return;
    }
    if (!confirm('Are you sure you want to approve this verification request?')) return
    
    const res = await fetch(`/api/verification-requests/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: adminId }) // <-- FIXED: Using the actual adminId
    })
    
    if (res.ok) {
      alert('Request approved successfully!')
      fetchRequests(adminId) // Re-fetch data
      setSelectedRequest(null)
    } else {
      alert('Failed to approve request')
    }
  }

  const handleReject = async (id: string) => {
    if (!adminId) {
        alert('Authentication Error: Admin ID is missing. Please log in.');
        return;
    }
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    
    const res = await fetch(`/api/verification-requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        adminId: adminId, // <-- FIXED: Using the actual adminId
        rejectionReason 
      })
    })
    
    if (res.ok) {
      alert('Request rejected successfully!')
      fetchRequests(adminId) // Re-fetch data
      setSelectedRequest(null)
      setShowRejectDialog(false)
      setRejectionReason('')
    } else {
      alert('Failed to reject request')
    }
  }

  // --- Conditional Rendering ---

  if (sessionLoading) return (
    <div className="container py-8">
      <div className="text-center">Loading authentication session...</div>
    </div>
  )

  if (!isAdmin) return (
    <div className="container py-8">
      <div className="text-center text-red-500 font-bold">ACCESS DENIED: You must be an administrator to view this page.</div>
    </div>
  )

  if (dataLoading) return (
    <div className="container py-8">
      <div className="text-center">Loading verification requests...</div>
    </div>
  )

  // --- Main Render ---

  return (
    <div className="container py-8 max-w-7xl">
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
                    onClick={() => handleApprove(req._id)}
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

      {/* View Details Dialog */}
      <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
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
                  onClick={() => handleApprove(selectedRequest._id)}
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
    </div>
  )
}
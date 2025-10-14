'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, CheckCircle, XCircle, Video, Search, Filter, Clock, Users, FileCheck, TrendingUp, Mail, Phone, Building, MapPin, Calendar, Award, ExternalLink } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminVerificationPage() {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    // Calculate stats whenever requests change
    const total = requests.length
    const pending = requests.filter((r: any) => r.verificationStatus === 'pending').length
    const approved = requests.filter((r: any) => r.verificationStatus === 'approved').length
    const rejected = requests.filter((r: any) => r.verificationStatus === 'rejected').length
    setStats({ total, pending, approved, rejected })
  }, [requests])

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/verification-requests')
    const data = await res.json()
    setRequests(data.requests || [])
    setLoading(false)
  }

  const handleApprove = async (id: string, pitchScore: number) => {
    const res = await fetch(`/api/verification-requests/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitchScore })
    })
    if (res.ok) {
      setNotification({ type: 'success', message: `Request approved with score ${pitchScore}/10!` })
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

  // Filter and search logic
  const filteredRequests = requests.filter((req: any) => {
    // Tab filter
    if (activeTab !== 'all' && req.verificationStatus !== activeTab) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        req.personalInfo.fullName.toLowerCase().includes(query) ||
        req.personalInfo.businessName.toLowerCase().includes(query) ||
        req.personalInfo.email.toLowerCase().includes(query) ||
        req.pitchData?.startupName?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }
    
    // Industry filter
    if (filterIndustry !== 'all' && req.personalInfo.industryType !== filterIndustry) return false
    
    return true
  })

  // Get unique industries for filter
  const industries = Array.from(new Set(requests.map((r: any) => r.personalInfo.industryType)))

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading verification requests...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-8">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Verification
              </h1>
              <p className="text-muted-foreground mt-2">Review and manage entrepreneur registration requests</p>
            </div>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <Users className="h-4 w-4 mr-2" />
              {stats.total} Total Requests
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer" onClick={() => setActiveTab('all')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">All Requests</p>
                    <p className="text-3xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('pending')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('approved')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold mt-2 text-green-500">{stats.approved}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500/50 transition-all cursor-pointer" onClick={() => setActiveTab('rejected')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold mt-2 text-red-500">{stats.rejected}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-4 max-w-md z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-600 border-2 border-green-400' 
            : 'bg-red-600 border-2 border-red-400'
        } text-white animate-in slide-in-from-top flex items-center gap-3`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, business, email, or startup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry: any) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({stats.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileCheck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterIndustry !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'No verification requests in this category'}
                  </p>
                </CardContent>
              </Card>
                ) : (
              filteredRequests.map((req: any) => (
                <Card key={req._id} className="border-2 hover:border-primary/50 transition-all group hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {req.personalInfo.fullName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {req.personalInfo.fullName}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Building className="h-3 w-3 mr-1" />
                                {req.personalInfo.businessName}
                              </Badge>
                              {req.pitchData?.startupName && (
                                <Badge variant="secondary" className="text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {req.pitchData.startupName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={
                            req.verificationStatus === 'pending' ? 'secondary' : 
                            req.verificationStatus === 'approved' ? 'default' : 
                            'destructive'
                          }
                          className="px-3 py-1"
                        >
                          {req.verificationStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {req.verificationStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {req.verificationStatus === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {req.verificationStatus.charAt(0).toUpperCase() + req.verificationStatus.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </div>
                        <p className="font-medium text-sm truncate">{req.personalInfo.email}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Phone className="h-3 w-3" />
                          Contact
                        </div>
                        <p className="font-medium text-sm">{req.personalInfo.contactNumber}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3" />
                          Industry
                        </div>
                        <p className="font-medium text-sm truncate">{req.personalInfo.industryType}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          Location
                        </div>
                        <p className="font-medium text-sm truncate">{req.personalInfo.country}</p>
                      </div>
                    </div>

                    {/* Pitch One-liner */}
                    {req.pitchData?.oneLiner && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <div className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-blue-500 mb-1">Pitch One-liner</p>
                            <p className="text-sm">{req.pitchData.oneLiner}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documents Badge */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">Documents:</span>
                      {req.documents.required.map((doc: any, idx: number) => (
                        doc.fileCount > 0 && (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {doc.documentType} ({doc.fileCount})
                          </Badge>
                        )
                      ))}
                      {req.documents.optional.map((doc: any, idx: number) => (
                        doc.fileCount > 0 && (
                          <Badge key={idx} variant="outline" className="text-xs opacity-60">
                            {doc.documentType} ({doc.fileCount})
                          </Badge>
                        )
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {req.pitchData?.videoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(req)
                            setShowVideoDialog(true)
                          }}
                          className="border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Watch Pitch
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRequest(req)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {req.verificationStatus === 'pending' && (
                        <>
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
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
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
            <DialogTitle>Approve Verification Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pitch Score (1-10)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  step="0.1"
                  defaultValue="7"
                  id="pitchScoreInput"
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Enter score"
                />
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">This score will be visible to investors in search filters</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => {
                const scoreInput = document.getElementById('pitchScoreInput') as HTMLInputElement
                const score = parseFloat(scoreInput?.value || '7')
                
                if (score < 1 || score > 10) {
                  setNotification({ type: 'error', message: 'Score must be between 1 and 10' })
                  setTimeout(() => setNotification(null), 3000)
                  return
                }
                
                selectedRequest && handleApprove(selectedRequest._id, score)
                setShowApproveDialog(false)
              }}>
                Confirm Approval
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Clock, Check, X, Truck, Box, Award, AlertCircle, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BaseApiUrl } from '@/utils/constanst';
import CertificateComponent from './CertificateComponent';
import { useRouter } from 'next/navigation'

const STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COLLECTED: 'collected',
  COMPLETED: 'completed'
};

const DonationRequests = ({ userData }) => {
  const router = useRouter()
  const [requests, setRequests] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dataDonor, setdataDonor] = useState([]);


  const fetchDonorData = async () => {
    const response = await fetch(`${BaseApiUrl}/denoted/getngo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'userid': userData?.user?.id
      }
    })
    const json = await response.json()
    console.log(json);
    setdataDonor(json.data)

  }

  useEffect(() => {
    fetchDonorData();
  }, [])











  // Simulated incoming donation request
  const incomingRequests = [
    // {
    //   id: 1,
    //   ngoName: "Green Earth Foundation",
    //   address: "123 Eco Street, Mumbai",
    //   items: ["Rice", "Dal", "Sugar"],
    //   status: STATUS.PENDING,
    //   timestamp: new Date().toISOString(),
    //   donor: "Harshit Nikam",
    //   contact: "+91 98765-43210"
    // },
  ];

  const getStatusColor = (status) => {
    const colors = {
      [STATUS.PENDING]: 'yellow',
      [STATUS.ACCEPTED]: 'blue',
      [STATUS.OUT_FOR_DELIVERY]: 'purple',
      [STATUS.COLLECTED]: 'orange',
      [STATUS.COMPLETED]: 'green'
    };
    return colors[status];
  };

  const getStatusText = (status) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleStatusUpdate = (donation, newStatus) => {
    const updatedDonations = acceptedDonations.map(d =>
      d.id === donation.id ? { ...d, status: newStatus } : d
    );
    setAcceptedDonations(updatedDonations);

    const statusMessages = {
      [STATUS.ACCEPTED]: 'Donation request accepted',
      [STATUS.OUT_FOR_DELIVERY]: 'Donation marked out for delivery',
      [STATUS.COLLECTED]: 'Donation marked as collected',
      [STATUS.COMPLETED]: 'Certificate issued successfully'
    };

    toast.success(statusMessages[newStatus]);
  };

  const handleAccept = async (request) => {
    const updatedRequest = {
      ...request,
      status: STATUS.ACCEPTED,
      acceptedAt: new Date().toISOString()
    };
    console.log(request);
    
    const response2 = await fetch(`${BaseApiUrl}/denoted/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'id': request._id
      }
    })
    const updatedItems = dataDonor.filter((item) => item._id !== request._id);
    setdataDonor(updatedItems); 

    const response3 = await fetch(`${BaseApiUrl}/user/user`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'id': request.userid
      }
    })
    const json3 = await response3.json()
    console.log(json3);
    


    const response = await fetch(`${BaseApiUrl}/history/`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      } ,
      body: JSON.stringify({ngoName:request.ngoid, userid:json3.resume._id,username:json3.resume.userName,phone:json3.resume.phone,address:json3.resume.address,item:request.item })
    }) 

    console.log("asdlfk");
    


    setAcceptedDonations(prev => [...prev, updatedRequest]);
    setRequests(prev => prev.filter(r => r._id !== request._id));
  };

  const handleReject = async (request) => {
    const response = await fetch(`${BaseApiUrl}/denoted/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'id': request._id
      }
    })
    // router.push("/")
    const updatedItems = dataDonor.filter((item) => item._id !== request._id);
    setdataDonor(updatedItems); 
    setRequests(prev => prev.filter(r => r._id !== request._id));
    toast.error('Donation request rejected');
  };

  const userdatafetchdirect = async (id) => {
    const response = await fetch(`${BaseApiUrl}/user/user`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'id': id
      }
    })
    const json = await response.json()

    return <>

      <p className="font-semibold text-lg">{json.resume.userName}</p>
      <p className="flex items-center text-gray-600">
        <MapPin className="mr-2 text-green-500" size={16} />
        123 Eco Street, Mumbai
      </p>
      <p className="flex items-center text-gray-600">
        <Clock className="mr-2 text-blue-500" size={16} />
        Email: +91 98765-43210
      </p>
    </>
  }

  const openCertificateDialog = (donation) => {
    setSelectedDonation(donation);
    setIsDialogOpen(true);
  };

  const issueCertificate = () => {
    handleStatusUpdate(selectedDonation, STATUS.COMPLETED);
    setIsDialogOpen(false);
  };

  const StatusButton = ({ donation }) => {
    switch (donation.status) {
      case STATUS.ACCEPTED:
        return (
          <Button
            onClick={() => handleStatusUpdate(donation, STATUS.OUT_FOR_DELIVERY)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Truck className="mr-2 h-4 w-4" />
            Mark Out for Delivery
          </Button>
        );
      case STATUS.OUT_FOR_DELIVERY:
        return (
          <Button
            onClick={() => handleStatusUpdate(donation, STATUS.COLLECTED)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Box className="mr-2 h-4 w-4" />
            Mark as Collected
          </Button>
        );
      case STATUS.COLLECTED:
        return (
          <Button
            onClick={() => openCertificateDialog(donation)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Award className="mr-2 h-4 w-4" />
            Issue Certificate
          </Button>
        );
      case STATUS.COMPLETED:
        return (
          <span className="flex items-center text-green-600">
            <Check className="mr-2 h-4 w-4" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <AlertCircle className="mr-2" />
            Pending Requests
          </h2>
          <AnimatePresence>
            {incomingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className="mb-4"
              >
                <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="mr-2 text-yellow-600" size={20} />
                        <span className="text-lg">New Donation Request</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-lg">{request.ngoName}</p>
                      <p className="flex items-center text-gray-600">
                        <MapPin className="mr-2 text-green-500" size={16} />
                        {request.address}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Clock className="mr-2 text-blue-500" size={16} />
                        Donor: {request.donor}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.items.map((item, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 bg-gray-50 p-4">
                    <Button
                      onClick={() => handleReject(request)}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleAccept(request)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {dataDonor?.map((request) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className="mb-4"
              >
                <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="mr-2 text-yellow-600" size={20} />
                        <span className="text-lg">New Donation Request</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {/* {new Date(request.timestamp).toLocaleDateString()} */}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col space-y-2">

               
                       <p className="font-semibold text-lg">{request.username}</p>
                      <p className="flex items-center text-gray-600">
                        <MapPin className="mr-2 text-green-500" size={16} />
                        {request.address}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Clock className="mr-2 text-blue-500" size={16} />
                        Phone: {request.phone}
                      </p> 
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request?.item?.map((item, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                          >
                            {item.itemName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 bg-gray-50 p-4">
                    <Button
                      onClick={() => handleReject(request)}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleAccept(request)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}


          </AnimatePresence>
        </div>

        {/* Active Donations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <Box className="mr-2" />
            Active Donations
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">NGO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acceptedDonations?.map((donation) => (
                    <motion.tr
                      key={donation._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{donation.ngoName}</div>
                          <div className="text-sm text-gray-500">{donation.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {donation?.item?.map((item, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item.itemName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs bg-${getStatusColor(donation.status)}-100 text-${getStatusColor(donation.status)}-800`}>
                          {getStatusText(donation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusButton donation={donation} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="mr-2 text-green-600" />
              Donation Achievement Certificate
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 ">
            <CertificateComponent
              username={dataDonor}
              donation={selectedDonation}
              onClose={() => {
                setIsDialogOpen(false);
                issueCertificate();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationRequests;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, User, Calendar, Building, Mail, Phone, Hash, Package, IndianRupee, Percent, AlertCircle } from 'lucide-react';
import invoiceService from '../services/invoiceService';

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  // Fetch invoice on mount
  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await invoiceService.getInvoiceById(id);
      setInvoice(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoice');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await invoiceService.downloadInvoicePDF(id);
    } catch (err) {
      alert(err.message || 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Number to words function
  const numberToWords = (num) => {
    if (!num) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      return n.toString();
    };

    return numToWords(Math.floor(num)) + ' Rupees Only';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-sm sm:text-base text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Error Loading Invoice</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error || 'Invoice not found'}</p>
          <button
            onClick={() => navigate('/invoices')}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invoices</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:w-[60vw] lg:w-[70vw] xl:w-[78vw]  2xl:w-full">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-base xl lg:text-3xl font-bold text-gray-800">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-sm sm:text-sm text-gray-600 mt-1">
            View and manage invoice details
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/invoices')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base order-1 sm:order-2 ${
              downloading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 print:shadow-none">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {invoice.company?.name || 'Your Company Name'}
            </h2>
            <div className="space-y-1 text-sm sm:text-base text-gray-600">
              <p>{invoice.company?.address || 'Company Address'}</p>
              <p>GST: {invoice.company?.gstNumber || 'N/A'}</p>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <div className="inline-block bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mb-2">
              <h3 className="text-sm sm:text-base font-semibold">TAX INVOICE</h3>
            </div>
            <div className="space-y-1 text-sm sm:text-base text-gray-600">
              <p className="font-medium">#{invoice.invoiceNumber}</p>
              <p>Date: {formatDate(invoice.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6">
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Bill To:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="font-medium text-gray-800">{invoice.customer?.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{invoice.customer?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              {invoice.customer?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{invoice.customer.phone}</span>
                </div>
              )}
              {invoice.customer?.gstNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="w-4 h-4 shrink-0" />
                  <span>GST: {invoice.customer.gstNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table - Desktop View */}
        <div className="hidden md:block overflow-x-auto mb-6 sm:mb-8">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Product</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">Qty</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">Price (₹)</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">GST%</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">Taxable</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">CGST</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">SGST</th>
                <th className="text-right py-3 px-3 text-gray-600 font-semibold text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm">{item.product?.name || 'Product'}</td>
                  <td className="text-right py-3 px-3 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-3 text-sm">{formatCurrency(item.price)}</td>
                  <td className="text-right py-3 px-3 text-sm">{item.gstRate}%</td>
                  <td className="text-right py-3 px-3 text-sm">{formatCurrency(item.itemTotal)}</td>
                  <td className="text-right py-3 px-3 text-sm text-green-600">{formatCurrency(item.itemCGST)}</td>
                  <td className="text-right py-3 px-3 text-sm text-green-600">{formatCurrency(item.itemSGST)}</td>
                  <td className="text-right py-3 px-3 text-sm font-medium">{formatCurrency(item.itemTotalWithGST)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Items - Mobile View */}
        <div className="md:hidden space-y-3 mb-6">
          {invoice.items?.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-medium text-gray-800">{item.product?.name || 'Product'}</h5>
                  <p className="text-xs text-gray-500 mt-1">GST: {item.gstRate}%</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Qty: {item.quantity}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded">
                  <span className="text-gray-500">Price:</span>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-gray-500">Taxable:</span>
                  <p className="font-medium">{formatCurrency(item.itemTotal)}</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-gray-500">CGST:</span>
                  <p className="text-green-600 font-medium">{formatCurrency(item.itemCGST)}</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-gray-500">SGST:</span>
                  <p className="text-green-600 font-medium">{formatCurrency(item.itemSGST)}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded col-span-2">
                  <span className="text-gray-700">Total:</span>
                  <p className="font-bold text-blue-600">{formatCurrency(item.itemTotalWithGST)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="flex flex-col items-end mt-6 sm:mt-8">
          <div className="w-full sm:w-96 space-y-2">
            <div className="flex justify-between py-2 text-sm sm:text-base">
              <span className="text-gray-600">Subtotal (Taxable):</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>

            <div className="flex justify-between py-2 bg-blue-50 rounded-lg px-3">
              <span className="text-gray-700 font-medium">Total GST:</span>
              <span className="font-bold text-blue-600">{formatCurrency((invoice.cgst || 0) + (invoice.sgst || 0))}</span>
            </div>

            <div className="flex justify-between py-1 pl-4 text-xs sm:text-sm">
              <span className="text-gray-500">↳ CGST (Total):</span>
              <span className="text-green-600">+{formatCurrency(invoice.cgst)}</span>
            </div>

            <div className="flex justify-between py-1 pl-4 text-xs sm:text-sm border-b pb-2">
              <span className="text-gray-500">↳ SGST (Total):</span>
              <span className="text-green-600">+{formatCurrency(invoice.sgst)}</span>
            </div>

            <div className="flex justify-between py-3 text-base sm:text-lg font-bold border-t mt-2">
              <span>Invoice Total:</span>
              <span className="text-blue-600">{formatCurrency(invoice.totalAmount)}</span>
            </div>

            <div className="text-right mt-4">
              <p className="text-xs sm:text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                {numberToWords(invoice.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">Thank you for your business!</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">This is a computer generated invoice</p>
          <p className="text-xs text-gray-400 mt-4">Invoice #{invoice.invoiceNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
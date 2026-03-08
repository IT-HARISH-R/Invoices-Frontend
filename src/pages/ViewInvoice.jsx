import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  // Number to words function (basic)
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
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
          {error || 'Invoice not found'}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice #{invoice.invoiceNumber}</h1>
        <div className="space-x-3">

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${downloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {downloading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Downloading...
              </span>
            ) : (
              '📥 Download PDF'
            )}
          </button>
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>

      {/* Invoice Content bv */}
      <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {invoice.company?.name || 'Your Company Name'}
            </h2>
            <p className="text-gray-600">{invoice.company?.address || 'Company Address'}</p>
            <p className="text-gray-600">GST: {invoice.company?.gstNumber || 'N/A'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-800">TAX INVOICE</h3>
            <p className="text-gray-600">#{invoice.invoiceNumber}</p>
            <p className="text-gray-600">Date: {formatDate(invoice.createdAt)}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <p className="text-gray-800">{invoice.customer?.name}</p>
          <p className="text-gray-600">{invoice.customer?.email}</p>
          <p className="text-gray-600">{invoice.customer?.phone}</p>
          <p className="text-gray-600">GST: {invoice.customer?.gstNumber || 'N/A'}</p>
        </div>

        {/* Items Table - Enhanced with GST details */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-right py-3 px-2">Qty</th>
                <th className="text-right py-3 px-2">Price (₹)</th>
                <th className="text-right py-3 px-2">GST%</th>
                <th className="text-right py-3 px-2">Taxable (₹)</th>
                <th className="text-right py-3 px-2">CGST (₹)</th>
                <th className="text-right py-3 px-2">SGST (₹)</th>
                <th className="text-right py-3 px-2">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-2">{item.product?.name || 'Product'}</td>
                  <td className="text-right py-3 px-2">{item.quantity}</td>
                  <td className="text-right py-3 px-2">₹{item.price?.toFixed(2)}</td>
                  <td className="text-right py-3 px-2">{item.gstRate}%</td>
                  <td className="text-right py-3 px-2">₹{item.itemTotal?.toFixed(2)}</td>
                  <td className="text-right py-3 px-2 text-green-600">₹{item.itemCGST?.toFixed(2)}</td>
                  <td className="text-right py-3 px-2 text-green-600">₹{item.itemSGST?.toFixed(2)}</td>
                  <td className="text-right py-3 px-2 font-medium">₹{item.itemTotalWithGST?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals - Enhanced with GST breakdown */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal (Taxable):</span>
              <span className="font-medium">₹{invoice.subtotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 bg-blue-50 rounded-lg px-2">
              <span className="text-gray-700 font-medium">Total GST:</span>
              <span className="font-bold text-blue-600">₹{(invoice.cgst + invoice.sgst)?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 pl-4 text-sm">
              <span className="text-gray-500">↳ CGST (Total):</span>
              <span className="text-green-600">+₹{invoice.cgst?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 pl-4 text-sm border-b">
              <span className="text-gray-500">↳ SGST (Total):</span>
              <span className="text-green-600">+₹{invoice.sgst?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 text-lg font-bold border-t mt-2">
              <span>Invoice Total:</span>
              <span className="text-blue-600">₹{invoice.totalAmount?.toFixed(2)}</span>
            </div>

            <p className="text-sm text-gray-600 mt-4 text-right italic">
              {numberToWords(invoice.totalAmount)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>Thank you for your business!</p>
          <p className="text-sm">This is a computer generated invoice</p>
          <p className="text-xs text-gray-400 mt-2">Invoice #{invoice.invoiceNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
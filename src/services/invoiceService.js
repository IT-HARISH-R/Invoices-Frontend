import api from './api';

const invoiceService = {
    // Get all invoices
    getAllInvoices: async () => {
        try {
            const response = await api.get('api/invoice');
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch invoices' };
        }
    },
 
    // Get single invoice
    getInvoiceById: async (id) => {
        try {
            const response = await api.get(`api/invoice/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch invoice' };
        }
    },

    // Create new invoice
    createInvoice: async (invoiceData) => {
        try {
            const response = await api.post('api/invoice', {
                company: invoiceData.company,
                customer: invoiceData.customer,
                items: invoiceData.items.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                }))
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create invoice' };
        }
    },

    // Download invoice PDF
    downloadInvoicePDF: async (id) => {
        try {
            const response = await api.get(`api/invoice/pdf/${id}`, {
                responseType: 'blob' // Important for PDF download
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return true;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to download PDF' };
        }
    },

    // Format date function
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    },

    // Calculate status based on due date or payment (customize as needed)
    getInvoiceStatus: (invoice) => {
        // You can add logic based on your backend status field
        // For now, returning 'Paid' or 'Unpaid' based on random or add status field in backend
        return invoice.status || 'Unpaid';
    }
};

export default invoiceService;
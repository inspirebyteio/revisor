document.addEventListener('DOMContentLoaded', () => {
    // Get payment details from local storage or URL parameters
    const transactionId = localStorage.getItem('transactionId');
    const payerName = localStorage.getItem('payerName');
    const amount = localStorage.getItem('amount');
    const servicesPurchased = JSON.parse(localStorage.getItem('servicesPurchased'));

    // Display confirmation details
    const confirmationDetails = `
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payer Name:</strong> ${payerName}</p>
        <p><strong>Amount Paid:</strong> $${amount}</p>
        <h3>Service(s) Purchased:</h3>
        <ul>
            ${servicesPurchased.map(item => `<li>${item.service}: ${item.api} - ${item.charge}</li>`).join('')}
        </ul>
    `;
    
    document.getElementById('confirmation-details').innerHTML = confirmationDetails;

    // Set up download button
    document.getElementById('download-btn').addEventListener('click', () => {
        downloadPDF(transactionId, payerName, amount, servicesPurchased);
    });
});

// Function to download PDF
function downloadPDF(transactionId, payerName, amount, servicesPurchased) {
    const { jsPDF } = window.jspdf; // Access jsPDF from the global window object
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(16);
    doc.text("Payment Confirmation", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transactionId}`, 14, 40);
    doc.text(`Payer Name: ${payerName}`, 14, 50);
    doc.text(`Amount Paid: $${amount}`, 14, 60);

    doc.text("Service(s) Purchased:", 14, 70);
    
    let y = 80; // Starting Y position for services list
    servicesPurchased.forEach(item => {
        doc.text(`${item.service}: ${item.api} - ${item.charge}`, 14, y);
        y += 10; // Increment Y position for each item
    });

    // Save the PDF
    doc.save(`payment_confirmation_${transactionId}.pdf`);
}
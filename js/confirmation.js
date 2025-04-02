document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from localStorage
    const basePrice = localStorage.getItem('basePrice');
    const transactionId = localStorage.getItem('transactionId');
    const payerName = localStorage.getItem('payerName');
    const amount = localStorage.getItem('amount'); // Total with GST
    const gstAmount = localStorage.getItem('gstAmount'); // GST amount separately
    const servicesPurchased = JSON.parse(localStorage.getItem('servicesPurchased'));

    // Redirect if data is missing
    if (!transactionId || !payerName || !amount || !gstAmount) {
        alert("Invalid access. Redirecting...");
        window.location.href = "index.html"; // Redirect to homepage
        return;
    }

    // Display confirmation details
    const confirmationDetails = `
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payer Name:</strong> ${payerName}</p>        
        <p><strong>Base Price:</strong> $${basePrice}</p>        
        <h3>Service(s) Purchased:</h3>
        <ul>
            ${servicesPurchased?.map(item => `<li>${item.service}: ${item.api} - ${item.charge}</li>`).join('') || "<li>No services</li>"}
        </ul>
        <p><strong>GST (18%):</strong> $${gstAmount}</p>
        <hr>
        <p><strong>Total Amount Paid:</strong> $${amount}</p>
    `;
    
    document.getElementById('confirmation-details').innerHTML = confirmationDetails;

    // Set up download button
    document.getElementById('download-btn').addEventListener('click', () => {
        downloadPDF(transactionId, payerName, basePrice, gstAmount, amount, servicesPurchased);
    });
});


// Function to download PDF with GST details
function downloadPDF(transactionId, payerName, basePrice, gstAmount, amount, servicesPurchased) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Confirmation", 14, 22);

    // Add a horizontal line after the title
    doc.setLineWidth(0.5);
    doc.line(14, 28, 200, 28);

    // Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Transaction details
    let y = 40;
    doc.text(`Transaction ID: ${transactionId}`, 14, y);
    y += 10;
    doc.text(`Payer Name: ${payerName}`, 14, y);
    y += 10;
    doc.text(`Base Price: $${basePrice}`, 14, y);
    y += 10;
    doc.text(`GST (18%): $${gstAmount}`, 14, y);
    y += 20; // Space between details and services section

    // Service(s) Purchased section
    doc.setFont("helvetica", "bold");
    doc.text("Service(s) Purchased:", 14, y);

    doc.setFont("helvetica", "normal");
    y += 10;
    if (servicesPurchased && servicesPurchased.length) {
        // Loop through services to list them
        servicesPurchased.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.text(`Service: ${item.service}`, 14, y);  // Bold service name
            y += 10;

            doc.setFont("helvetica", "normal");
            doc.text(`API: ${item.api}`, 14, y);         // Normal API name
            y += 10;

            doc.text(`Charge: ${item.charge}`, 14, y);    // Normal charge
            y += 15;  // Extra space between services
        });
    } else {
        doc.text("No services purchased", 14, y);
        y += 10;
    }

    // Total amount section
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount Paid: $${amount}`, 14, y);

    // Add a line after total amount for a clean finish
    y += 10;
    doc.line(14, y, 200, y);

    // Save the PDF with a customized filename
    doc.save(`payment_confirmation_${transactionId}.pdf`);
}

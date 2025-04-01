/*
// Pricing Toggle Option
function showBase() {
    document.getElementById('pricing-name').innerText = 'Base Plan';
    document.getElementById('pricing-price').innerText = '$99 / month';
    document.querySelectorAll('.pricing-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.pricing-btn:nth-child(1)').classList.add('active');
}

function showPremium() {
    document.getElementById('pricing-name').innerText = 'Premium Plan';
    document.getElementById('pricing-price').innerText = '$199 / month';
    document.querySelectorAll('.pricing-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.pricing-btn:nth-child(2)').classList.add('active');
}
*/








document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.getElementById('serviceSelect');
    const apiOptions = document.getElementById('apiOptions');
    const cartList = document.getElementById('cartList');
    const totalPrice = document.getElementById('totalPrice');

    let selectedServices = [];
    let total = 199;
    let paypalButtonsRendered = false; // Track if PayPal buttons are rendered

    // Fetch data from services.json
    fetch('data/services.json')
        .then(response => response.json())
        .then(data => {
            populateServiceSelect(data.services);
            displayApiOptions(data.services[0]);
        })
        .catch(error => console.error('Error loading services data:', error));

    // Populate service select dropdown
    function populateServiceSelect(services) {
        services.forEach((service, index) => {
            if (index > 0) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = service.name;
                serviceSelect.appendChild(option);
            }
        });
    }


    // Display API options based on selected service
    function displayApiOptions(service) {
        apiOptions.innerHTML = '';
        service.apis.forEach(api => {
            const apiTile = document.createElement('div');
            apiTile.className = `api-option ${api.isPreferred ? 'preferred' : ''}`;

            apiTile.innerHTML = `
                <h3>${api.name}</h3>
                <p>Integration Charge: ${api.charge}</p>
                <p>Features: ${api.features.join(', ')}</p>
                <br>
                <button class="select-btn">Select</button>
            `;

            apiTile.querySelector('.select-btn').addEventListener('click', () => {
                addToCart(api, service.name);
            });

            apiOptions.appendChild(apiTile);
        });
    }


    // Add selected API to the cart
    function addToCart(api, serviceName) {
        const existingItemIndex = selectedServices.findIndex(item => item.service === serviceName);
        if (existingItemIndex !== -1) {
            selectedServices.splice(existingItemIndex, 1);
        }

        selectedServices.push({
            service: serviceName,
            api: api.name,
            charge: api.charge
        });

        updateCart();
    }


    // Update cart display and total price
    function updateCart() {
        cartList.innerHTML = '';
        total = 199;

        selectedServices.forEach(item => {
            const listItem = document.createElement('li');

            listItem.innerHTML = `
                ${item.service}: ${item.api} - ${item.charge}
                <button class="remove-btn">×</button>
            `;

            listItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(item.service);
            });

            cartList.appendChild(listItem);
            total += parseFloat(item.charge.replace('$', ''));
        });

        totalPrice.textContent = `$${total.toFixed(2)}`;
        

        // Render or update PayPal button
        if (selectedServices.length > 0) {
            renderPayPalButton();
        } else {
            document.getElementById('paypal-button-container').innerHTML = ''; // Clear button if no items
        }
    }


    // Remove API from cart
    function removeFromCart(serviceName) {
        selectedServices = selectedServices.filter(item => item.service !== serviceName);
        updateCart();
    }

    
    // Render PayPal button
    function renderPayPalButton() {
        if (!paypalButtonsRendered) { // Check if buttons are already rendered
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { currency_code: "USD", value: total.toFixed(2) }
                        }],
                        application_context: {
                            return_url: 'https://revisor.in/confirmation.html', // Replace with your return URL
                            cancel_url: 'https://revisor.in/cancel.html' // Optional cancel URL
                        }
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        // Store payment details in local storage
                        localStorage.setItem('basePrice', 199);
                        localStorage.setItem('transactionId', details.id);
                        localStorage.setItem('payerName', `${details.payer.name.given_name} ${details.payer.name.surname}`);
                        localStorage.setItem('amount', total.toFixed(2));
                        localStorage.setItem('servicesPurchased', JSON.stringify(selectedServices));
            
                        // Redirect to confirmation page
                        window.location.href = 'confirmation.html';
                    }).catch(function(error) {
                        // Handle errors during capture
                        console.error('Payment capture error:', error);
                        alert('There was an issue completing your payment. Please try again.');
                        // Optionally redirect to a different page or show a retry option
                    });
                },
                onError: function(err) {
                    // Handle errors during the order creation or approval process
                    console.error('PayPal Button Error:', err);
                    alert('An error occurred while processing your payment. Please check your details and try again.');
                    // Redirect to confirmation page
                    window.location.href = 'cancel.html';
                    // Optionally redirect to a different page or show a retry option
                }
            }).render('#paypal-button-container'); // Render the button in the specified container
            
            paypalButtonsRendered = true; // Set flag to true after rendering
        } else { 
            // If already rendered, just update the order details by calling createOrder again
            paypal.Buttons().update(); // This will refresh the order details based on current total.
        }
    }

    // Handle service selection change
    serviceSelect.addEventListener('change', (event) => {
        const selectedIndex = event.target.value;
        fetch('data/services.json')
            .then(response => response.json())
            .then(data => {
                displayApiOptions(data.services[selectedIndex]);
            })
            .catch(error => console.error('Error loading services data:', error));
    });
});





// FAQs

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.accordion-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;

            // Close any open accordion content
            document.querySelectorAll('.accordion-content').forEach(item => {
                if (item !== content) {
                    item.style.display = 'none';
                }
            });

            // Toggle the clicked accordion content
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});













// Slideshow of services in index.html
document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/services.json')
      .then(response => response.json())
      .then(data => {
        const services = data.services;
        const slideshowContent = document.getElementById('slideshow-content');
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');
  
        services.forEach(service => {
          const slide = document.createElement('div');
          slide.className = 'slide';
          slide.innerHTML = `
            <img src="${service.serviceIcon}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
          `;
          slideshowContent.appendChild(slide);
        });
  
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const slidesToShow = 3;
        const slideWidth = slideshowContent.clientWidth / slidesToShow;
  
        function updateSlides(index) {
          slideshowContent.style.transform = `translateX(${-index * slideWidth}px)`;
          prevButton.classList.toggle('arrow-disabled', index === 0);
          nextButton.classList.toggle('arrow-disabled', index >= slides.length - slidesToShow);
        }
  
        function changeSlide(n) {
          slideIndex = Math.max(0, Math.min(slides.length - slidesToShow, slideIndex + n));
          updateSlides(slideIndex);
        }
  
        prevButton.addEventListener('click', () => changeSlide(-1));
        nextButton.addEventListener('click', () => changeSlide(1));
  
        // Drag functionality
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let currentIndex = 0;
  
        slideshowContent.addEventListener('mousedown', (event) => {
          isDragging = true;
          startPos = event.pageX;
          animationID = requestAnimationFrame(animation);
          slideshowContent.style.cursor = 'grabbing';
        });
  
        slideshowContent.addEventListener('mouseup', () => {
          isDragging = false;
          cancelAnimationFrame(animationID);
          const movedBy = currentTranslate - prevTranslate;
          if (movedBy < -100 && slideIndex < slides.length - slidesToShow) {
            slideIndex++;
          }
          if (movedBy > 100 && slideIndex > 0) {
            slideIndex--;
          }
          updateSlides(slideIndex);
          slideshowContent.style.cursor = 'grab';
        });
  
        slideshowContent.addEventListener('mousemove', (event) => {
          if (isDragging) {
            const currentPosition = event.pageX;
            currentTranslate = prevTranslate + currentPosition - startPos;
          }
        });
  
        function animation() {
          slideshowContent.style.transform = `translateX(${currentTranslate}px)`;
          if (isDragging) requestAnimationFrame(animation);
        }
  
        // Initial update
        updateSlides(slideIndex);
      })
      .catch(error => console.error('Error fetching services:', error));
  });
  

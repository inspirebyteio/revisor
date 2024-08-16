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
    let total = 0;

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
            if(index>0){
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
                const remove_no_service_selected_note = document.getElementById('no-service-selected-note');
                remove_no_service_selected_note.style.display="none";
                addToCart(api, service.name);
            });

            apiOptions.appendChild(apiTile);
        });
    }

    // Add selected API to the cart
    function addToCart(api, serviceName) {
        // Remove existing entry if already selected
        const existingItemIndex = selectedServices.findIndex(item => item.service === serviceName);
        if (existingItemIndex !== -1) {
            selectedServices.splice(existingItemIndex, 1);
            updateCart();
        }

        // Add new entry
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
    }

    // Remove API from cart
    function removeFromCart(serviceName) {
        selectedServices = selectedServices.filter(item => item.service !== serviceName);
        updateCart();

        if (selectedServices.length === 0) {
            const noServiceSelectedNote = document.getElementById('no-service-selected-note');
            noServiceSelectedNote.style.display = "block"; 
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






















/*
// Display Builtin Service in Pricing serction using services.json
document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/services.json')
        .then(response => response.json())
        .then(data => displayPricingTile(data))
        .catch(error => console.error('Error fetching JSON:', error));
});

function displayPricingTile(data){
    const container = document.getElementById("builtin-services");
    for (let i = 0; i < 4; i++) {
        const serviceName = data.services[i].name;
        const serviceApi = data.services[i].apis.filter(api => api.isPreferred);
        const serviceApiName = serviceApi[0].name;
        const serviceCharge = serviceApi[0].charge;
        
        const service_line = document.createElement('p');
        service_line.textContent = serviceName+' : '+serviceApiName+', '+serviceCharge;

        container.appendChild(service_line);
        
}
}
*/













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
  




//CHANGE LOGO URL
/*
  document.addEventListener('DOMContentLoaded', function() {
    const teamImgContainer = document.querySelector('.logo');
    const teamImage = document.getElementById('logo-image');

    teamImgContainer.addEventListener('mouseover', function() {
        teamImage.src = '../images/logo-orange.png'; // Replace with the path to your hover image
    });

    teamImgContainer.addEventListener('mouseout', function() {
        teamImage.src = '../images/logo-white.png'; // Replace with the path to your original image
    });
});
*/
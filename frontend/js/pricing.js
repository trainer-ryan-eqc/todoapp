// Declaring Pricing variables ↓
        
const free = document.getElementById('freePrice');
const starter = document.getElementById('starterPrice');
const premium = document.getElementById('premiumPrice');
const business = document.getElementById('businessPrice');
const priceButton = document.getElementById('priceButton');
const buttonBall = document.getElementById('buttonBall');

const freeDiscountMessage = document.getElementById('freeDiscountMessage');
const starterDiscountMessage = document.getElementById('starterDiscountMessage');
const premiumDiscountMessage = document.getElementById('premiumDiscountMessage');
const businessDiscountMessage = document.getElementById('businessDiscountMessage');

const term = document.querySelectorAll('.term');

const monthly = "/ Month";
const annually = "/ Year";

// Declaring monthly pricing variables ↓

const freePriceMonthly = 0;
const starterPriceMonthly = 29;
const premiumPriceMonthly = 75;
const businessPriceMonthly = 140;

// Discount ↓

const discount = 25 // 15% discount for annual pricing
const discountDecimal = discount / 100;

// Function to calculate discount based on plan price ↓

function calculateDiscount(planPrice) {
    return ((planPrice * 12) * discountDecimal).toFixed(0);
};

// Declaring annual pricing variables (monthly pricing x 12 - % discount) and rounding up (removing decimals) ↓

const freePriceAnnually = (freePriceMonthly * 12) - ((freePriceMonthly * 12) * discountDecimal).toFixed(0);
const starterPriceAnnually = (starterPriceMonthly * 12) - ((starterPriceMonthly * 12) * discountDecimal).toFixed(0);
const premiumPriceAnnually = (premiumPriceMonthly * 12) - ((premiumPriceMonthly * 12) * discountDecimal).toFixed(0);
const businessPriceAnnually = (businessPriceMonthly * 12) - ((businessPriceMonthly * 12) * discountDecimal).toFixed(0);

// Setting default values (monthly) ↓

free.innerHTML = `$${freePriceMonthly}`;
starter.innerHTML = `$${starterPriceMonthly}`;
premium.innerHTML = `$${premiumPriceMonthly}`;
business.innerHTML = `$${businessPriceMonthly}`;

term.forEach(element => {
    element.innerHTML = monthly;
});

// function to switch values between monthly & annually when button is clicked ↓

function priceButtonToggle() {
    if (buttonBall.classList.contains('left')) {
        buttonBall.classList.remove('left');
        buttonBall.classList.add('right');
        
        free.innerHTML = `$${freePriceAnnually}`;
        starter.innerHTML = `$${starterPriceAnnually}`;
        premium.innerHTML = `$${premiumPriceAnnually}`;
        business.innerHTML = `$${businessPriceAnnually}`;

        freeDiscountMessage.innerHTML = "No discount for free plan"; // No discount message for free plan
        premiumDiscountMessage.innerHTML = `${discount}% off! Save $${calculateDiscount(starterPriceMonthly)}!`;
        starterDiscountMessage.innerHTML = `${discount}% off! Save $${calculateDiscount(premiumPriceMonthly)}!`; 
        businessDiscountMessage.innerHTML = `${discount}% off! Save $${calculateDiscount(businessPriceMonthly)}!`;

        term.forEach(element => {
            element.innerHTML = annually;
        });
    } else {
        buttonBall.classList.remove('right');
        buttonBall.classList.add('left');

        free.innerHTML = `$${freePriceMonthly}`;
        starter.innerHTML = `$${starterPriceMonthly}`;
        premium.innerHTML = `$${premiumPriceMonthly}`;
        business.innerHTML = `$${businessPriceMonthly}`;

        freeDiscountMessage.innerHTML = ``; // No discount message for free plan
        starterDiscountMessage.innerHTML = ``; // No discount message for starter plan  
        premiumDiscountMessage.innerHTML = ``; // No discount message for premium plan
        businessDiscountMessage.innerHTML = ``; // No discount message for business plan

        term.forEach(element => {
            element.innerHTML = monthly;
        });
    }
}
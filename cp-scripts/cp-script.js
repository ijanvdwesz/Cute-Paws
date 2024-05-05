//logic for my modified searchbar
//selects searchform brings it to js and adds evenlistener
document.querySelector(".searchForm").addEventListener("submit", (event) => {
  event.preventDefault(); //prevents default form behaviour
  //stores the lowercase of the input value
  let searchedFor = document.querySelector(".searchInput").value.toLowerCase();
  //selects all elements with this class and stores in variable (to be looped through)
  let searchingTrhu = document.querySelectorAll(".searchable");
  //loops through them
  searchingTrhu.forEach((element) => {
    //gets all the text from the elements and stores in variable
    let pageContent = element.innerText.toLowerCase();
    //gets the images,stores them in a array and maps over them extracting the alts
    let altTexts = Array.from(element.querySelectorAll("img")).map((img) =>
      img.alt.toLowerCase()
    );
    //if the searched for is in the page display in block
    if (pageContent.includes(searchedFor) || altTexts.includes(searchedFor)) {
      element.style.display = "block";
    } else {
      //if not dont display
      element.style.display = "none";
    }
  });
});
//creates my dropdown accordian effect
$(function () {
  $(".submenu").hover(
    //when hovered over
    function () {
      //find the sibling element containing this class and slide it up
      $(this).siblings().find(".submenu-body").slideUp();
      $(this).find(".submenu-body").slideToggle(); //hides&shows by sliding
    }
  );
});

let savedLink = document.querySelector(".saved-link"); //brings my link for saved4later page

$(function () {
  function generateCommentForm(existingComments) {
    // generates the comment form dynamically
    let commentForm = $(`
      <div class="comments-form">
        <h3>Comments</h3>
        <ul class="existing-comments">
        </ul>
        <form class="comment-form">
          <label for="comment-input">Add a comment:</label>
          <input type="text" id="comment-input" class="comment-input" required>
          <button class="submit-button"
           type="submit">Submit</button>
        </form>
      </div>
    `);
    //some css for the coment form using jquery
    commentForm.find("h3,label").css({
      color: "red",
      fontSize: "30px",
    });

    commentForm.find(".existing-comments").css({
      display: "flex",
      flexDirection: "column",
      color: "red",
      fontSize: "26px",
    });

    //finds the comment form by class name and loops through each item and add a list element
    let existingCommentsList = commentForm.find(".existing-comments");
    existingComments.forEach((comment) => {
      existingCommentsList.append(`<li>${comment}</li>`);
    });

    // Returns the generated comment form
    return commentForm;
  }

  // Attaches event delegation for the comments button clicks
  $(document).on("click", ".comments", function () {
    // Gets the closest saved item by class
    let savedItem = $(this).closest(".savable-item");

    /*removes all other comment forms except this one (was neccessary otherwise empty <li> gets 
      retrieved from open comment forms)*/
    $(".comments-form").not(savedItem.find(".comments-form")).remove();
    //gets the comments from session storage by id or an empty array
    let existingComments =
      JSON.parse(sessionStorage.getItem(savedItem.attr("id") + "_comments")) ||
      [];

    // Checks if the comment form is already attached
    let commentForm = savedItem.find(".comments-form");
    if (commentForm.length === 0) {
      // Generate and append the comment form
      commentForm = generateCommentForm(existingComments);
      savedItem.append(commentForm);
    }

    // display the comment form
    commentForm.show();
  });

  // Attaches event listener for submitting the comment form
  $(document).on("submit", ".comment-form", addComment);
  // Function for adding comments
  function addComment(event) {
    event.preventDefault(); //prevents defualt form submission behaviour
    let comment = $(".comment-input").val(); //stores the value entered into comment form
    let savedItem = $(this).closest(".comments"); //selects the closest element with this class
    let existingComments =
      JSON.parse(sessionStorage.getItem(savedItem.attr("id") + "_comments")) ||
      []; //gets the existing comments aray
    existingComments.push(comment); //and adds the new comment
    //stores it back into session Storage
    sessionStorage.setItem(
      savedItem.attr("id") + "_comments",
      JSON.stringify(existingComments)
    );
    //Gets the updated list back again (for displaying)
    existingComments =
      JSON.parse(sessionStorage.getItem(savedItem.attr("id") + "_comments")) ||
      [];
    //clears the input field
    $(".comment-input").val("");
    //and removes the form
    $(this).closest(".comments-form").remove();
  }

  // Retrieve the saved items list from sessionStorage
  let savedItemsListJSON = localStorage.getItem("savedItemsList");
  let savedItemsDisplay = JSON.parse(savedItemsListJSON) || [];

  // Function to attach save and comments buttons to each savable item
  function attachButtons() {
    $(".savable-item").each(function () {
      //{do for every .savable-item}
      //creates these 2 buttons adds the classes and text
      let saveButton = $("<button>").addClass("save").text("Save for Later");
      let commentsButton = $("<button>").addClass("comments").text("Comments");
      $(this).append(saveButton, commentsButton); //attaches them (to .savable-item)
      //styles the buttons
      saveButton.add(commentsButton).css({
        borderRadius: "20px",
        backgroundColor: "red",
        color: "white",
      });
    });
  }

  // Function to save an item for later
  function save4Later(event) {
    //the closest savable item gets stored in avariable
    let item = $(this).closest(".savable-item");
    $(this).text("Saved").prop("disabled", true); //change the text and disable the button
    let savedItem = item.html(); //take the html content of the saved item
    savedItemsDisplay.push(savedItem); //add it to display
    //stores it in local storage and adds an id
    localStorage.setItem(item.attr("id") + "_comments", JSON.stringify([]));
    localStorage.setItem("savedItemsList", JSON.stringify(savedItemsDisplay));
    //gets the length of the list and stores it in varaible
    let quantitySaved = savedItemsDisplay.length;
    /*displays the alertmessage with the quantity(i used a confirm dialog instead in order to add
     the option to navigate to the page )*/
    let alertMessage = `You currently have ${quantitySaved} items saved for later. 
    Click OK to view them or Cancel to continue.`;
    let userResponse = confirm(alertMessage);
    if (userResponse) {
      //if confirmed (ok) opens the link on a new page
      window.open(savedLink, "_blank");
    } else {
      //if not do nothing
    }
  }

  // Attaches event delegation for the save button clicks
  $(document).on("click", ".save", save4Later);

  // Attaches buttons to savable items
  attachButtons();

  // loops through the items
  savedItemsDisplay.forEach(function (savedItem) {
    //adds list elements to them
    let listItem = $("<li>").html(savedItem);
    //adds this class (for search function)
    listItem.addClass("searchable-item");
    //finds and removes the buttons and forms
    listItem.find("button, form").remove();
    listItem.find(".comments-form").remove(); // Remove comments form
    //attaches the list element ro the <ul> with specified class
    $(".saved-items-list").append(listItem);
  });
});
//this toggles hide/show when contact details(class='.hide-show') is clicked
let intervalId = null;
$(document).ready(function () {
  $(".hide-show").click(function () {
    $(".contact-input").toggle();
  });
});

/*sets this (wheter its clicked or not) outside the function for global scope to be accessable by both slide and stop functions*/
let liked = false;
//stores my images in an array(images are different sizes of same image)
$(function () {
  let heartImgs = [
    "cp-images/favicon.jpg",
    "cp-images/logo-38.jpg",
    "cp-images/logo-45.jpg",
    "cp-images/logo-52.jpg",
  ];

  // lets the current index be the first(smallest)
  let currentHeartIndex = 0;

  // Attaches click event handler to all heart elements
  $(document).on("click", ".heart", function () {
    // Gets which heart element is clicked
    let clickedHeart = $(this);

    // if its not already clicked(cycling images)
    if (!clickedHeart.data("heartCycling")) {
      // Start cycling heart images
      let intervalId = setInterval(function () {
        // Updates the source of the clicked heart image
        clickedHeart.attr("src", heartImgs[currentHeartIndex]);

        // Increments the index for the next image
        currentHeartIndex = (currentHeartIndex + 1) % heartImgs.length;
      }, 300);

      // Stores the intervalId and cycling state in the data attributes of the clicked heart
      clickedHeart.data("intervalId", intervalId);
      clickedHeart.data("heartCycling", true);
    } else {
      //if its been clicked before (in cycle)

      // Stop cycling heart images
      clearInterval(clickedHeart.data("intervalId"));

      // Clears the stored intervalId and update the cycling state
      clickedHeart.data("intervalId", null);
      clickedHeart.data("heartCycling", false);
    }
  });

  // adds the hearts to .like class items
  $(".like").append(
    '<img src="cp-images/favicon.jpg" alt="heart-icon" class="heart">'
  );
});

//gets the link for cart page into the js
let cartLink = document.querySelector(".cart-link");

// just to check if the cartitems list exist if not its an empty array
function initializeCartItemsList() {
  let cartItemsList = JSON.parse(localStorage.getItem("cartItemsList"));
  if (!cartItemsList) {
    localStorage.setItem("cartItemsList", JSON.stringify([]));
  }
}

// Function to display cart items (similar to display the saved items)
function displayCartItems() {
  //gets the list from local storage
  let savedItemsDisplay =
    JSON.parse(localStorage.getItem("cartItemsList")) || [];
  let cartItemsList = $(".cart-items-list");
  cartItemsList.empty(); /* Clear previous items (not the stored in local storage ones the ones
     on the page otherwise itl lead to duplication of entire page)*/
  savedItemsDisplay.forEach(function (cartItem) {
    //loops through the items
    let listItem = $("<li>").html(cartItem); //adds a list element to each
    listItem.addClass("searchable-item"); //adds the class for search bar
    listItem.find("button,form").remove(); //removes the buttons and forms
    listItem.find(".comments-form").remove(); // Remove comments form
    cartItemsList.append(listItem); //adds it to the <ul>
  });
}

// Function to add item to cart (please see the save4later function )
function addToCart() {
  let cItem = $(this).closest(".savable-item");
  let cartItem = cItem.html();
  let cartItemsDisplay =
    JSON.parse(localStorage.getItem("cartItemsList")) || [];
  cartItemsDisplay.push(cartItem);
  localStorage.setItem("cartItemsList", JSON.stringify(cartItemsDisplay));
  displayCartItems();

  let quantityAdded = cartItemsDisplay.length;
  let alertMessage = `You currently have ${quantityAdded} items in the cart. Click OK to view them or Cancel to continue.`;
  let userResponse = confirm(alertMessage);
  if (userResponse) {
    window.open(cartLink.href, "_blank");
  } else {
  }
}

// Attaches event delegation for the "Add to cart" button clicks
$(document).on("click", ".add", addToCart);

// Calls displayCartItems to display items when the page loads
$(document).ready(function () {
  initializeCartItemsList();
  displayCartItems();
});
$(document).ready(function () {
  // Sets background attachment to fixed for the body
  $("body").css("backgroundAttachment", "fixed");
});
$(document).ready(function () {
  // styles my submit buttons
  $(".submit-button").css({
    "background-color": "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    "border-radius": "5px",
    transition: "background-color 0.3s",
  });

  // changes the color when hovered over
  $(".submit-button").hover(
    function () {
      $(this).css("background-color", "red");
    },
    function () {
      $(this).css("background-color", "rgb(246, 120, 141)");
    }
  );
});

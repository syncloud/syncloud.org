 $(document).ready(function() {
                $.getJSON("apps.json").done(function (data) {
                    $("#apps").html(_.template($("#app-template").html())(data));
                    
                    
                    
                     function replaceCategoryNames(categories) {
                  // Create a mapping of values to their respective names
                  const categoryMap = categories;

                  // Get all divs with the class 'appcategory'
                  const appCategoryDivs = document.querySelectorAll('div.appcategory');

                  // Replace the content of each div with the corresponding category name
                  appCategoryDivs.forEach(div => {
                      const categoryValue = div.textContent.trim(); // Get the text content of the div
                      if (categoryMap[categoryValue]) {
                          div.textContent = categoryMap[categoryValue]; // Replace with the corresponding name
                      }
                  });
                  
                  // Get the select element
                  const select = document.getElementById('categories');

                  // Add options dynamically
                  for (const value in categoryMap) {
                      if (categoryMap.hasOwnProperty(value)) {
                          const option = document.createElement('option');
                          option.value = value;
                          option.textContent = categoryMap[value];
                          select.appendChild(option);
                      }
                  }
              }

              // Call the function to replace category names
              $.getJSON("app-categories.json").done(function (categories) {
                replaceCategoryNames(categories);
              });   
              
    
function updateView() {
    const sortValue = $('#sort-apps').val();
    const selectedCategory = $('#categories').val();
    const searchValue = $('#search-bar').val().toLowerCase();
    const $appBlocks = $('.threeblock');

    const sortedBlocks = $appBlocks.sort((a, b) => {
        const appNameA = $(a).find('.appnametext').text().toLowerCase();
        const appNameB = $(b).find('.appnametext').text().toLowerCase();
        const categoryA = $(a).find('.appcategory').text().toLowerCase();
        const categoryB = $(b).find('.appcategory').text().toLowerCase();

        if (sortValue === 'sort-a-z') {
            return appNameA.localeCompare(appNameB);
        } else if (sortValue === 'sort-z-a') {
            return appNameB.localeCompare(appNameA);
        } else if (sortValue === 'sort-categories') {
            return categoryA.localeCompare(categoryB);
        }
    });

    sortedBlocks.each(function() {
        const appName = $(this).find('.appnametext').text().toLowerCase();
        const appCategory = $(this).find('.appcategory').text().toLowerCase();

        if ((selectedCategory === 'all' || $(this).hasClass(selectedCategory)) &&
            (appName.includes(searchValue) || searchValue === '')) {
            $(this).css('display', 'inline-block');
        } else {
            $(this).css('display', 'none');
        }
    });

    $('#apps').empty().append(sortedBlocks);
}

function toggleSortCategoriesOption() {
    const selectedCategory = $('#categories').val();
    const $sortCategoriesOption = $('#sort-apps option[value="sort-categories"]');

    if (selectedCategory === 'all') {
        $sortCategoriesOption.show();
    } else {
        $sortCategoriesOption.hide();
        // Reset sort option to the first option if "Categories" is hidden
        if ($('#sort-apps').val() === 'sort-categories') {
            $('#sort-apps').val($('#sort-apps option:first').val());
        }
    }
}

// Event listeners for updating the view and toggling the sort categories option
document.getElementById('categories').addEventListener('change', () => {
    toggleSortCategoriesOption();
    updateView();
});
document.getElementById('sort-apps').addEventListener('change', updateView);
document.getElementById('search-bar').addEventListener('input', updateView);

// Initial check for toggling the sort categories option
toggleSortCategoriesOption();
    
                    
                });
                init_page("apps");

        

    });
    
   
    
    
     document.addEventListener('DOMContentLoaded', function() {
                var isListView = false;
    
                function renderApps(apps) {
                    var template = _.template(document.getElementById('app-template').innerHTML);
                    document.getElementById('apps').innerHTML = template({ apps: apps });
                }
                
               
                
                

                

        document.getElementById('toggle-view').addEventListener('click', function() {
            isListView = !isListView;
            document.getElementById('apps').className = isListView ? 'rowthree list-view' : 'rowthree grid-view';
            
            // Change the icon based on the view
            this.innerHTML = isListView ? '<i class="fas fa-th"></i>' : '<i class="fas fa-list"></i>';
        });
                
                 loadApps(renderApps);
    
     
            });
            
            
            
          
            
            
   


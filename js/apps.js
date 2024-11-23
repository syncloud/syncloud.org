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
              
              function sortApps() {
            const sortValue = $('#sort-apps').val();
            const $appBlocks = $('.threeblock');

            // Sort the appBlocks based on the selected option
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

            // Clear the current app blocks from the container and append sorted blocks
            $('#apps').empty().append(sortedBlocks);
        }

        // Initial sort on page load
        sortApps();
        
        
        // Sort when the select option changes
        $('#sort-apps').change(sortApps);
                    
                    
                });
                init_page("apps");

        

    });
    
    document.getElementById('categories').addEventListener('change', function() {
        const selectedValue = this.value;
        const allDivs = document.querySelectorAll('.threeblock');

        allDivs.forEach(div => {
            if (selectedValue === 'all') {
                div.style.display = 'inline-block'; 
            } else {
                div.style.display = div.classList.contains(selectedValue) ? 'inline-block' : 'none'; 
            }
        });
    });

    // Trigger change event on page load to show the default selection
    document.getElementById('categories').dispatchEvent(new Event('change'));
    
    
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
            
            
            
            document.getElementById('search-bar').addEventListener('input', function() { 
            const searchValue = this.value.toLowerCase(); 
            console.log(searchValue);
            const allDivs = document.querySelectorAll('.threeblock'); 
            allDivs.forEach(div => { 
            const appName = div.querySelector('.appnametext').innerText.toLowerCase(); 
            if (appName.includes(searchValue) || searchValue === '') { div.style.display = 'inline-block'; } 
            else { div.style.display = 'none'; } 
            }); 
            });
            
            
   


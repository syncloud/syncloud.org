   
    $(document).ready(function() {
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        const appName = getQueryParam('app');

        $.getJSON("apps.json").done(function(data) {
            const filteredApps = appName ? data.apps.filter(app => app.id === appName) : data.apps;
            const appId = filteredApps.length > 0 ? filteredApps[0].id : null;
            const appdronefileurl = filteredApps.length > 0 ? filteredApps[0].appdronefile : null;
            const getprojectrepoapi = filteredApps.length > 0 ? filteredApps[0].projectrepoapi : null;
            
            $("#apps-detail").html(_.template($("#app-template-detail").html())({ apps: filteredApps }));

            // Initialize the theme selection script after the content is loaded
    
    const themeIcon = document.getElementById('theme-icon');
    const themeLink = document.getElementById('theme-link');
    const codeContent = document.getElementById('code-content');
    const currentURL = window.location.href;

function updateCodeContent() {
   
        
        let newSrc;

        if (this.value === 'dark') {
            newSrc = 'https://github.com/syncloud/syncloud.org/raw/master/images/badge_dark.svg';
        } else {
            newSrc = 'https://github.com/syncloud/syncloud.org/raw/master/images/badge_bright.svg';
        }

        themeIcon.src = newSrc;
        themeLink.href = currentURL;
        
        codeContent.innerHTML = `&lt;a href=&quot;${currentURL}&quot; target=&quot;_blank&quot;&gt; &lt;img src=&quot;${newSrc}&quot; alt=&quot;Syncloud App&quot;&gt; &lt;/a&gt;`;

        
    }

    
    // Initial 
        updateCodeContent();
        
        
        // Change
        $('#theme-select').change(updateCodeContent);
    
    // image slider
    
    const carousel = document.getElementById('myCarousel');
    const carouselwrapper = document.getElementById('carouselWrapper');
    
    const zoomButton = document.getElementById('zoomButton');
    let isExpanded = false;

    zoomButton.addEventListener('click', function() {
      if (!isExpanded) {
        carousel.classList.add('expanded');
        carouselwrapper.classList.add('expanded2');
        carouselWrapper.style.position = 'fixed';
        zoomButton.innerHTML = '<i class="fa-solid fa-magnifying-glass-minus"></i>';
        zoomButton.classList.remove('zoom-in');
        zoomButton.classList.add('zoom-out');
        isExpanded = true;
      } else {
        carousel.classList.remove('expanded');
        carouselwrapper.classList.remove('expanded2');
        carouselWrapper.style.position = 'relative';
        zoomButton.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
        zoomButton.classList.remove('zoom-out');
        zoomButton.classList.add('zoom-in');
        isExpanded = false;
      }
    });


 

var contentDiv2 = document.getElementById('mdcontent2');
                if (contentDiv2) {
                    var url = contentDiv2.getAttribute('data-url');
                    fetch(url)
                        .then(response => response.text())
                        .then(text => {
                            var converter = new showdown.Converter();
                            var html = converter.makeHtml(text);
                            contentDiv2.innerHTML = html;
                        });
                } else {
                    console.error('contentDiv2 is null');
                }
                
                // Function to copy content 
                function copyContent() { var originalContent = document.getElementById('mdcontent2').innerHTML; 
                document.getElementById('mdcontent2-overlay').innerHTML = originalContent; } 
                // Toggle visibility of the overlay div 
                document.getElementById('toggleButton').addEventListener('click', function() { var overlay = document.getElementById('overlay'); 
                var fadeoutContent = document.getElementById('mdcontent2'); 
                copyContent(); 
                // Copy content when the button is clicked 
                if (overlay.style.display === 'none' || overlay.style.display === '') { overlay.style.display = 'block'; 
                fadeoutContent.style.display = 'none'; 
                // Hide the default shown content 
                } else { overlay.style.display = 'none'; fadeoutContent.style.display = 'block'; 
                // Show the default shown content 
                } }); 
                // Close button functionality 
                document.getElementById('closebtn').addEventListener('click', function() { 
                document.getElementById('overlay').style.display = 'none'; 
                document.getElementById('mdcontent2').style.display = 'block'; 
                // Show the default shown content 
                });
                
            function replaceCategoryNames2(categories) {
              var categoryText = $('#fixedCategory').text().trim();
              if (categories[categoryText]) {
                $('#fixedCategory').text(categories[categoryText]);
              }
            }


            
            // Call the function to replace category names
              $.getJSON("app-categories.json").done(function (categories) {
                replaceCategoryNames2(categories);
              }); 
              
              //Get drone jsonnet data
              function getAppVersion(url, appName) { 
              $.get(url, function(data) { 
              var regex = new RegExp('local ' + appName + ' = "(\\d+\\.\\d+\\.\\d+)"'); 
              var match = data.match(regex); 
              if (match) { $('#app_version').text(match[1]); } 
              else { $('#app_version').text('Version not found'); } }); } 
              getAppVersion(appdronefileurl, appId);
              
              //Get git data
              $.get(getprojectrepoapi, function(data) { 
              const stargazersCount = data.stargazers_count; 
              $('#stargazers-count').text(stargazersCount); 
              const license_name = data.license.name; 
              $('#license-name').text(license_name);
              }); 


        });



        init_page("app-detail");
    });

        function share(platform) {
            const url = encodeURIComponent(window.location.href);
            let shareUrl = '';

            switch(platform) {
                case 'mastodon':
                    shareUrl = `https://mastodon.social/share?text=${url}`;
                    break;
                case 'signal':
                    shareUrl = `https://signal.me/#p/${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=Check this out&body=${url}`;
                    break;
            }

            window.open(shareUrl, '_blank');
        }
        
        function copyToClipboard() {
    const codeBox = document.getElementById('code-content');
    const range = document.createRange();
    range.selectNode(codeBox);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Code copied to clipboard!');
}
   

   
    $(document).ready(function() {
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        const appName = getQueryParam('app');

        $.getJSON("apps.json").done(function(data) {
            const filteredApps = appName ? data.apps.filter(app => app.id === appName) : data.apps;
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
        zoomButton.textContent = '-';
        isExpanded = true;
      } else {
        carousel.classList.remove('expanded');
        carouselwrapper.classList.remove('expanded2');
        carouselWrapper.style.position = 'relative';
        zoomButton.textContent = '+';
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
                
                // Toggle visibility of the content div
            document.getElementById('toggleButton').addEventListener('click', function() {
                var contentDiv2 = document.getElementById('overlay');
                if (contentDiv2.style.display === 'none' || contentDiv2.style.display === '') {
                    contentDiv2.style.display = 'block';
                } else {
                    contentDiv2.style.display = 'none';
                }
            });

            // Close button functionality
            document.getElementById('closebtn').addEventListener('click', function() {
                document.getElementById('overlay').style.display = 'none';
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
   

---
layout: default
title: Download
---

<script type="text/javascript">
    $(function(){
            /*$('#dialog_link, ul#icons li').hover(
            function() { $(this).addClass('ui-state-hover'); },
            function() { $(this).removeClass('ui-state-hover'); }
            );*/

/*
        $('#dialog_link').click(function(){
            $('#dialog').dialog('open');
            return false;
        });
*/

        $( "#accordion" ).accordion({ autoHeight: false });
//        $( "#linux-32-bit" ).button({ icons: {primary:'ui-icon-arrowthickstop-1-s'} });


//        $( ".selector" ).button({ icons: {primary:'ui-icon-gear',secondary:'ui-icon-triangle-1-s'} });


        if (navigator.platform.indexOf("Windows") != -1) {
            $('#accordion').accordion( "activate" , 0 );
        } else if (navigator.platform.indexOf("Linux") != -1) {
            $('#accordion').accordion( "activate" , 1 );
        } else if (navigator.platform.indexOf("Mac") != -1) {
            $('#accordion').accordion( "activate" , 2 );
        }


    });
</script>
<style type="text/css">
    .download_link {padding: .4em 1em .4em 20px;text-decoration: none;position: relative;}
    .download_link span.ui-icon {margin: 0 5px 0 0;position: absolute;left: .2em;top: 50%;margin-top: -8px;}
    /*ul#icons {margin: 0; padding: 0;}*/
    /*ul#icons li {margin: 2px; position: relative; padding: 4px 0; cursor: pointer; float: left;  list-style: none;}*/
    /*ul#icons span.ui-icon {float: left; margin: 0 4px;}*/
</style>


<div class="container_12">

    <div>&nbsp;</div>

    <div id="accordion">

        <h3><a href="#">Windows</a></h3>

            <div>

                <h6>Archive</h6>

                    <a href="https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.exe" id="download_windows_32_link" class="download_link ui-state-default ui-corner-all">
                        <span class="ui-icon ui-icon-newwin"> </span>Get 32 bit</a>
            </div>

        <h3><a href="#">Linux</a></h3>

            <div>

                <h6>Ubuntu 12.10 package</h6>

                    1. Add personal package archive: <strong>sudo add-apt-repository ppa:ribalkin/syncloud</strong> (<a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">more info</a>)<br>
                    2. Update: <strong>sudo apt-get update</strong><br>
                    3. Install: <strong>sudo apt-get install syncloud</strong><br>

                <h6>Archive</h6>

                    <a href="https://github.com/downloads/syncloud/syncloud/syncloud-linux-amd64-0.0.1-SNAPSHOT.tar.gz" id="download_linux_64_link" class="download_link ui-state-default ui-corner-all">
                        <span class="ui-icon ui-icon-newwin"> </span>Get 64 bit</a>
                    <a href="https://github.com/downloads/syncloud/syncloud/syncloud-linux-i386-0.0.1-SNAPSHOT.tar.gz" id="download_linux_32_link" class="download_link ui-state-default ui-corner-all">
                        <span class="ui-icon ui-icon-newwin"> </span>Get 32 bit</a>

            </div>

        <h3><a href="#">Mac</a></h3>

        <div>

            <h6>No packages yet</h6>

        </div>
    </div>

    <div>&nbsp;</div>
</div>


---
layout: default
title: Download
---
        
<script type="text/javascript">
    $(function(){

        $( "#accordion" ).accordion({ autoHeight: false });

        /*if ($.client.os == "Windows") {
            $('#accordion').accordion( "activate" , 0 );
        } else if ($.client.os == "Linux") {
            //hover states on the static widgets
            $('#accordion').accordion( "activate" , 1 );
        }*/


        /*$('#dialog_link, ul#icons li').hover(
                function() { $(this).addClass('ui-state-hover'); },
                function() { $(this).removeClass('ui-state-hover'); }
        );*/

    });
</script>

<div class="container_12">

    <div>&nbsp;</div>

    <div id="accordion">

        <h3><a href="#">Windows</a></h3>

        <div>
            <a href="https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.exe">download installer</a>
        </div>

        <h3><a href="#">Linux</a></h3>

        <div>
            <h6>Ubuntu 12.10 (package)</h6>
                1. Add PPA: <a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">launchpad instruction</a><br>
                2. Update packages: sudo apt-get update<br>
                3. Install by executing: sudo apt-get install syncloud<br>
            <h6>Linux (standalone archive)</h6>
                <a href="https://github.com/downloads/syncloud/syncloud/syncloud-linux-amd64-0.0.1-SNAPSHOT.tar.gz">32 bit</a><br>
                <a href="https://github.com/downloads/syncloud/syncloud/syncloud-linux-i386-0.0.1-SNAPSHOT.tar.gz">64 bit</a><br>
        </div>
    </div>

    <div>&nbsp;</div>
</div>


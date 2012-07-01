---
layout: default
title: Download
---

<script type="text/javascript">
    $(function(){

        $( "#accordion" ).accordion({ autoHeight: false });

        if (navigator.platform.indexOf("Windows") != -1) {
            $('#accordion').accordion( "activate" , 0 );
        } else if (navigator.platform.indexOf("Linux") != -1) {
            $('#accordion').accordion( "activate" , 1 );
        } else if (navigator.platform.indexOf("Mac") != -1) {
            $('#accordion').accordion( "activate" , 2 );
        }

        $( "#windows32" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#windows32" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.exe";
        });

        $( "#linux32" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#linux32" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-i386-0.0.1-SNAPSHOT.tar.gz";
        });

        $( "#linux64" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#linux64" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-amd64-0.0.1-SNAPSHOT.tar.gz";
        });
    });
</script>

<div class="container_12">

    <div class="grid_1">&nbsp;</div>

    <div id="accordion" class="grid_10">

        <h3><a href="#">Windows</a></h3>

            <div>

                <h6>Installer</h6>
                    <button id="windows32">Get 32 bit</button>

            </div>

        <h3><a href="#">Linux</a></h3>

            <div>

                <h6>Ubuntu 12.10 package</h6>

                    1. Add personal package archive: <strong>sudo add-apt-repository ppa:ribalkin/syncloud</strong> (<a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">more info</a>)<br>
                    2. Update: <strong>sudo apt-get update</strong><br>
                    3. Install: <strong>sudo apt-get install syncloud</strong><br>
                <br>

                <h6>Archive</h6>
                    <button id="linux32">Get 32 bit</button>
                    <button id="linux64">Get 64 bit</button>
            </div>

        <h3><a href="#">Mac</a></h3>

        <div>

            <h6>No packages yet</h6>

        </div>
    </div>

    <div class="grid_1">&nbsp;</div>
</div>


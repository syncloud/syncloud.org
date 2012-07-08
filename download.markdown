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

        $( "#windows32_exe" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#windows32_exe" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.exe";
        });

        $( "#windows32_zip" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#windows32_zip" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.zip";
        });

        $( "#linux32_targz" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#linux32_targz" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-i386-0.0.1-SNAPSHOT.tar.gz";
        });

        $( "#linux64_targz" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#linux64_targz" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-amd64-0.0.1-SNAPSHOT.tar.gz";
        });

        $( "#macosx32_app" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#macosx32_app" ).click(function() {
            window.location.href = "";
        });
    });
</script>

<div class="container_12">

    <div class="grid_1">&nbsp;</div>

    <div class="grid_10">

        <h3>Download</h3>

        <div id="accordion">

        <h3><a href="#">Windows</a></h3>

            <div>

                <h6>Installer</h6>
                    <button id="windows32_exe">Get 32 bit</button>
                <br/>
                <br/>

                <h6>Archive</h6>
                    <button id="windows32_zip">Get 32 bit</button>

            </div>

        <h3><a href="#">Linux</a></h3>

            <div>

                <h6>Ubuntu 12.10 package</h6>

                    1. Add personal package archive: <strong>sudo add-apt-repository ppa:ribalkin/syncloud</strong> (<a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">more info</a>)<br/>
                    2. Update: <strong>sudo apt-get update</strong><br/>
                    3. Install: <strong>sudo apt-get install syncloud</strong><br/>
                <br/>

                <h6>Archive</h6>
                    <button id="linux32_targz">Get 32 bit</button>
                    <button id="linux64_targz">Get 64 bit</button>
            </div>

        <h3><a href="#">Mac OS X</a></h3>

            <div>

                <h6>Application Bundle</h6>
                <button id="macosx32_app">Get 32 bit</button>
            </div>
        </div>

    </div>

    <div class="grid_1">&nbsp;</div>
</div>


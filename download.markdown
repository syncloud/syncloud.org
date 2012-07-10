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
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-0.0.1-SNAPSHOT.zip";
        });

        $( "#macosx32_app" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });

        $( "#macosx32_app" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-macosx-0.0.1-SNAPSHOT.dmg";
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
                <img style="float: right;" src="/images/windows.png"/>
                <h6>Download</h6>
                    <button id="windows32_exe">Installer</button>
                    <button id="windows32_zip">Binaries</button>

            </div>

        <h3><a href="#">Linux</a></h3>
            <div>
                <div>
                    <img style="float: right;" src="/images/ubuntu.png"/>
                    <h6>Ubuntu 12.10</h6>
                        You can install syncloud from <a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">personal package archive</a>:<br/>
                        1. Add PPA: <strong>sudo add-apt-repository ppa:ribalkin/syncloud</strong><br/>
                        2. Update: <strong>sudo apt-get update</strong><br/>
                        3. Install: <strong>sudo apt-get install syncloud</strong><br/>
                    <br/>
                </div>

                <div>
                    <img style="float: right;" src="/images/linux.png"/>
                    <h6>Download</h6>
                        <button id="linux32_targz">Binaries</button>
                </div>
            </div>

        <h3><a href="#">Mac OS X</a></h3>
            <div>
                <img style="float: right;" src="/images/macosx.png"/>
                <h6>Download</h6>
                    <button id="macosx32_app">Disk Image</button>
            </div>
        </div>

    </div>

    <div class="grid_1">&nbsp;</div>
</div>


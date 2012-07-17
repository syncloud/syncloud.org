---
layout: default
title: Download
---

<script type="text/javascript">

    function showPlatform(platform) {
        $( ".platform").each(function() {
            if (this.id.startsWith(platform)) $(this).show();
            else $(this).hide();
        });

        $( ".other_platforms > button").each(function() {
            if (this.id.startsWith("other_"+platform)) $(this).hide();
            else $(this).show();
        });
    }

    function getPlatform() {
        var platform = "unknown";
        if (navigator.platform.indexOf("Windows") != -1) {
            platform = "windows";
        } else if (navigator.platform.indexOf("Linux") != -1) {
            platform = "linux";
        } else if (navigator.platform.indexOf("Mac") != -1) {
            platform = "mac";
        }
        return platform;
    }

    $(function(){

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.slice(0, str.length) == str;
            };
        }

        showPlatform(getPlatform());

        $( ".download_button").each(function() {
            $( "#"+this.id ).button({
                icons: {
                    primary: "ui-icon-arrowthickstop-1-s"
                }
            });
        });

        $( "#windows32_exe" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.exe";
        });

        $( "#windows32_zip" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-windows-0.0.1-SNAPSHOT.zip";
        });

        $( "#linux32_targz" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-linux-0.0.1-SNAPSHOT.zip";
        });

        $( "#macosx32_app" ).click(function() {
            window.location.href = "https://github.com/downloads/syncloud/syncloud/syncloud-macosx-0.0.1-SNAPSHOT.dmg";
        });

        $( ".other_platforms > button").each(function() {
            $( "#"+this.id ).button();
        });

        $( "#other_windows" ).click(function() { showPlatform("windows"); });
        $( "#other_linux_ubuntu" ).click(function() { showPlatform("linux_ubuntu"); });
        $( "#other_linux_other" ).click(function() { showPlatform("linux_other"); });
        $( "#other_mac" ).click(function() { showPlatform("mac"); });
    });
</script>

<div class="container_12">

    <div class="grid_1">&nbsp;</div>

    <div class="grid_10 download">
        <h3>Download</h3>
        <br/>
        <h5>Latest Release: 0.1</h5>

        <div id="windows" class="platform">
            <img src="/images/windows.png"/>
            <div>
                <h6>Windows</h6>
                <button id="windows32_exe" class="download_button">Installer</button>
                <button id="windows32_zip" class="download_button">Binaries</button>
            </div>
        </div>

        <div id="linux_ubuntu" class="platform">
            <img src="/images/ubuntu.png"/>
            <div>
                <h6>Ubuntu</h6>
                You can install syncloud on Ubuntu 12.10 from <a href="https://code.launchpad.net/~ribalkin/+archive/syncloud">personal package archive</a>:<br/>
                1. Add PPA: <strong>sudo add-apt-repository ppa:ribalkin/syncloud</strong><br/>
                2. Update: <strong>sudo apt-get update</strong><br/>
                3. Install: <strong>sudo apt-get install syncloud</strong><br/>
            </div>
        </div>

        <div id="linux_other" class="platform">
            <img src="/images/linux.png"/>
            <div>
                <h6>Other Linux</h6>
                <button id="linux32_targz" class="download_button">Binaries</button>
            </div>
        </div>

        <div id="mac" class="platform">
            <img src="/images/macosx.png"/>
            <div>
                <h6>Mac OS X</h6>
                <button id="macosx32_app" class="download_button">Disk Image</button>
            </div>
        </div>

        <div id="other_platforms" class="other_platforms">
            <h6>Other Platforms</h6>
            <button id="other_windows"><div><img src="/images/windows48.png"/><p>Windows</p></div></button>
            <button id="other_linux_ubuntu"><div><img src="/images/ubuntu48.png"/><p>Ubuntu</p></div></button>
            <button id="other_linux_other"><div><img src="/images/linux48.png"/><p>Other Linux</p></div></button>
            <button id="other_mac"><div><img src="/images/macosx48.png"/><p>Mac OS X</p></div></button>
        </div>

        <br/>
    </div>

    <div class="grid_1">&nbsp;</div>
</div>
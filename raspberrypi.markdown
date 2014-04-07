---
layout: device
title: Raspberry Pi

boardname: Raspberry Pi
releaseversion: v0.4
imagefile: syncloud-raspberrypi-v0.4.img
---

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">1. Get Hardware</span></h3>
        <img class="center-block img-responsive" src="images/board-raspberrypi-modelb.jpg" style="padding: 13px"/>

        <p>Buy <a href="http://www.raspberrypi.org/">Raspberry Pi (Model B)</a> single-board computer and external USB hard drive.
        </p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">2. Get Software</span></h3>

        <img class="center-block img-responsive" src="images/software-debian.png"/>

        <p>Download syncloud image for <a onClick="_gaq.push(['_trackEvent', 'Images', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="https://github.com/syncloud/owncloud-setup/releases/download/{{page.releaseversion}}/{{page.imagefile}}.xz">{{page.boardname}}</a>.
        </p>
    </div>

</div>

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">3. Install Software</span></h3>
        <br>
        <p>Flash Raspberry Pi using microSD card (2GB or more):</p>
        <div>
            <p><span class="badge">1</span><span style="padding-left: 10pt">Uncompress image file (Linux/Mac):</span></p>
            <p><span style="padding-left: 25pt"></span><code>unxz {{page.imagefile}}.xz</code></p>
            <p><span style="padding-left: 25pt">Or use <a onClick="_gaq.push(['_trackEvent', '7Zip', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://www.7-zip.org">7-zip</a> on Windows</p>

            <p><span class="badge">2</span><span style="padding-left: 10pt">Write image to SD card (Linux/Mac):</span></p>
            <p><span style="padding-left: 25pt"></span><code>sudo dd if=./{{page.imagefile}} of=/dev/mmcblk0</code></p>
            <p><span style="padding-left: 25pt"></span>Or use <a onClick="_gaq.push(['_trackEvent', 'win32diskimager', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://sourceforge.net/projects/win32diskimager">Win32 Disk Imager</a> on Windows</p>

            <p><span class="badge">3</span><span style="padding-left: 10pt">Insert SD card into device</span></p>
            <p><span class="badge">4</span><span style="padding-left: 10pt">Power on</span></p>
        </div>
        <p>Syncloud image is based on <a onClick="_gaq.push(['_trackEvent', 'Raspbian', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://www.raspberrypi.org/downloads">Raspbian</a></p>
        <p>SSH login / password: pi / raspberry</p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">4. Connect Everything</span></h3>
        <br>
        <p>Connect USB hard drive to device. Don't forget to create ext4 partition on the drive.<br/>Connect your device to your home router. Use one of the available LAN ports.<br/>Turn the device on by inserting power cable.
        </p>

        <img class="center-block img-responsive" src="images/schema-raspberrypi-logo.png" style="max-width: 80%; margin: 0 auto"/>

    </div>

</div>

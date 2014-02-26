---
layout: device
title: Raspberry Pi

boardname: Raspberry Pi
releaseversion: v0.2
imagefile: syncloud-raspberrypi-v0.2.img
---

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">1. Get Hardware</span></h3>
        <img class="center-block img-responsive" src="images/raspberry-pi-model-b.jpg"/>

        <p>Buy <a href="http://www.raspberrypi.org/">Raspberry Pi (Model B)</a> single-board computer and external USB hard drive.
        </p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">2. Get Software</span></h3>

        <img class="center-block img-responsive" src="images/debian-owncloud.png"/>

        <p>Download syncloud image for <a onClick="_gaq.push(['_trackEvent', 'Images', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="https://github.com/syncloud/owncloud-setup/releases/download/{{page.releaseversion}}/{{page.imagefile}}.xz">{{page.boardname}}</a>.
        </p>
    </div>

</div>

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">3. Install Software</span></h3>
        <br>
        <p>Flash BeagleBone Black using microSD card (2GB or more):</p>

        <h5><span class="badge">1</span><span style="padding-left: 10pt">Uncompress image file:</span></h5>
        <span style="padding-left: 25pt"></span><code>unxz {{page.imagefile}}.xz</code>

        <h5><span class="badge">2</span><span style="padding-left: 10pt">Write image to SD card:</span></h5>
        <span style="padding-left: 25pt"></span><code>sudo dd if=./{{page.imagefile}} of=/dev/mmcblk0</code>

        <h5><span class="badge">3</span><span style="padding-left: 10pt">Insert SD card into device</span></h5>
        <h5><span class="badge">4</span><span style="padding-left: 10pt">Power on</span></h5>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">4. Connect Everything</span></h3>
        <br>
        <p>Connect USB hard drive to device. Don't forget to create ext4 partition on the drive.<br/>Connect your device to your home router. Use one of the available LAN ports.<br/>Turn the device on by inserting power cable.
        </p>

        <img class="center-block img-responsive" src="images/beagle-setup.png"/>

    </div>

</div>

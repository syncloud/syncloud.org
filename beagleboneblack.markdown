---
layout: device
title: BeagleBone Black

boardname: BeagleBone Black
releaseversion: v0.6
imagefile: syncloud-beagleboneblack-v0.6.img
boardpicture=board-beagleboneblack.png
boardsite=http://beagleboard.org/Products/BeagleBone+Black
storage-type=external USB
---

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">3. Install Software</span></h3>
        <br>
        <p>Flash BeagleBone Black using microSD card (2GB or more):</p>
        <div>
            <p><span class="badge">1</span><span style="padding-left: 10pt">Uncompress image file (Linux/Mac):</span></p>
            <p><span style="padding-left: 25pt"></span><code>unxz {{page.imagefile}}.xz</code></p>
            <p><span style="padding-left: 25pt">Or use <a onClick="_gaq.push(['_trackEvent', '7Zip', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://www.7-zip.org">7-zip</a> on Windows</p>

            <p><span class="badge">2</span><span style="padding-left: 10pt">Write image to SD card (On Linux/Mac):</span></p>
            <p><span style="padding-left: 25pt"></span><code>sudo dd if=./{{page.imagefile}} of=/dev/mmcblk0</code></p>
            <p><span style="padding-left: 25pt"></span>Or use <a onClick="_gaq.push(['_trackEvent', 'win32diskimager', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://sourceforge.net/projects/win32diskimager">Win32 Disk Imager</a> on Windows</p>

            <p><span class="badge">3</span><span style="padding-left: 10pt">Insert SD card into device</span></p>
            <p><span class="badge">4</span><span style="padding-left: 10pt">Power on while holding user button</span></p>
            <p><span class="badge">5</span><span style="padding-left: 10pt">Wait until all LEDs are steady on</span></p>
            <p><span class="badge">6</span><span style="padding-left: 10pt">Power off (by taking power cable out)</span></p>
            <p><span class="badge">7</span><span style="padding-left: 10pt">Remove SD card from device</span></p>
        </div>
        <p>Syncloud image is based on <a onClick="_gaq.push(['_trackEvent', 'BeagleBoardUbuntu', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="http://elinux.org/BeagleBoardUbuntu">BeagleBoardUbuntu</a></p>
        <p>SSH login / password: root / syncloud</p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">4. Connect Everything</span></h3>
        <br>
        <p>Connect USB hard drive to device. Don't forget to create ext4 partition on the drive.<br/>Connect your device to your home router. Use one of the available LAN ports.<br/>Turn the device on by inserting power cable.
        </p>

        <img class="center-block img-responsive" src="images/schema-beagleboneblack-logo.png" style="max-width: 80%; margin: 0 auto"/>

    </div>

</div>

---
layout: default
title: BeagleBone Black
style: device

boardname: BeagleBone Black
releaseversion: v0.1
imagefile: syncloud-beagleboneblack-v0.1.img
---

<div class="jumbotron">
    <div class="container">

        <h1>Build your own online storage</h1>

        <p>This guide will help you to get personal online storage. You can access your files online from anywhere, use them on your mobile or desktop devices and share files with your friends. Feel free to <a href="http://groups.google.com/group/syncloud">contact us</a> if you have any questions.
        </p>

    </div>
</div>

<div class="container">

        <div class="row">

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">1. Get Hardware</span></h3>
                <img class="center-block img-responsive" src="images/beagleboneblack.png"/>

                <p>Buy <a href="http://beagleboard.org/Products/BeagleBone+Black">BeagleBone Black</a> single-board computer and external USB hard drive.
                </p>
            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">2. Get Software</span></h3>

                <img class="center-block img-responsive" src="images/owncloud-400.png"/>

                <p>Download syncloud image for <a onClick="_gaq.push(['_trackEvent', 'Images', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="https://github.com/syncloud/owncloud-setup/releases/download/{{page.releaseversion}}/{{page.imagefile}}.xz">BeagleBone Black</a>
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
                <h5><span class="badge">4</span><span style="padding-left: 10pt">Power on while holding user button</span></h5>
                <h5><span class="badge">5</span><span style="padding-left: 10pt">Wait until all LEDs are steady on</span></h5>
                <h5><span class="badge">6</span><span style="padding-left: 10pt">Power off (by taking power cable out)</span></h5>
                <h5><span class="badge">7</span><span style="padding-left: 10pt">Remove SD card from device</span></h5>
            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">4. Connect Everything</span></h3>
                <br>
                <p>Connect USB hard drive to device. Don't forget to create ext4 partition on the drive.<br/>Connect your device to your home router. Use one of the available LAN ports.<br/>Turn the device on by inserting power cable.
                </p>

                <img class="center-block img-responsive" src="images/beagle-setup.png"/>

            </div>

        </div>

        <div class="row">

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">5. Locate Storage Address</span></h3>
                <br>
                <p>Use Bonjor Browser to figure out an IP address of your storage. Your local storage should appear under "ownCloud" name. Use the IP address in the following url:</p>
                <code>http://[ip address]/owncloud</code>
                <br>
                <br>
                <div class="carousel slide" data-ride="carousel" style="width: 351px; margin: 0 auto">
                    <!-- Indicators 
                    <ol class="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                    </ol>
                    -->

                    <!-- Wrapper for slides -->
                    <div class="carousel-inner">
                        <div class="item active">
                            <img src="images/bonjour-avahi.png">
                        </div>
                        <div class="item">
                            <img style="border: #999999 1px solid;" src="images/bonjour-android.png">
                        </div>
                        <div class="item">
                            <img style="border: #999999 1px solid;" src="images/bonjour-iphone.png">
                        </div>
                    </div>
                </div>
                <br>


                <p>Download and install Bonjour Browser:</p>
                <div class="btn-group">
                    <a class="btn btn-large btn-default" href="http://hobbyistsoftware.com/Downloads/BonjourBrowser/BonjourBrowserSetup.exe"><i class="fa fa-windows"></i> Windows</a>
                    <a class="btn btn-large btn-default" href="http://www.tildesoft.com/files/BonjourBrowser.dmg"><i class="fa fa-apple"></i> Mac OS X</a>
                    <a class="btn btn-large btn-default" href="https://apps.ubuntu.com/cat/applications/avahi-discover"><i class="fa fa-linux"></i> Linux</a>
                    <a class="btn btn-large btn-default" href="https://play.google.com/store/apps/details?id=com.grokkt.android.bonjour"><i class="fa fa-android"></i> Android</a>
                    <a class="btn btn-large btn-default" href="https://itunes.apple.com/gb/app/discovery-bonjour-browser/id305441017"><i class="fa fa-apple"></i> iPhone</a>
                </div>
            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">6. Finish Setup</span></h3>
                <br>
                <p>You need to create an administrative account. Open url found in step 5 in your browser. You should see the page like shown below. Provide login and password for admin account. Since admin account has full access to files keep it's credentials in secret.</p>

                <img class="center-block img-responsive" src="images/owncloud-finish-setup.png">
            </div>

        </div>

        <div class="row">

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">7. Access from Anywhere</span></h3>
                <br>
                <p>Your storage is available online from anywhere. The address of your storage could be found in admin settings of ownCloud under UPnP Port Mapper section:</p>

                <p></p>

                <img class="center-block img-responsive" style="border: #999999 1px solid;" src="images/upnp_address.png">

                <p></p>

                <p>The public IP address is available from anywhere via Internet. Use this address to connect ownCloud client applications or just open this address in your browser.</p>
            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">8. Use It!</span></h3>
                <br>
                
                <p>Now you ready to use your online storage! Access. Sync. Share. <a href="http://owncloud.org/features/">Learn more</a> about ownCloud features.</p>
                <p></p>

                <div id="courousel-use" class="carousel slide" style="width: 452px; margin: 0 auto">
                    <ol class="carousel-indicators">
                        <li data-target="#courousel-use" data-slide-to="0" class="active"></li>
                        <li data-target="#courousel-use" data-slide-to="1"></li>
                        <li data-target="#courousel-use" data-slide-to="2"></li>
                    </ol>

                    <!-- Wrapper for slides -->
                    <div class="carousel-inner">
                        <div class="item active">
                            <img style="border: #999999 1px solid;" src="images/use-browser.png">
                        </div>
                        <div class="item">
                            <img style="border: #999999 1px solid;" src="images/use-android.png">
                        </div>
                        <div class="item">
                            <img style="border: #999999 1px solid;" src="images/use-iphone.png">
                        </div>
                    </div>

                    <!-- Controls -->
                    <a class="left carousel-control" href="#courousel-use" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left"></span>
                    </a>
                    <a class="right carousel-control" href="#courousel-use" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right"></span>
                    </a>

                </div>
                <br>


                <p>Download ownCloud client application for your platform:</p>
                <div class="btn-group">
                    <a class="btn btn-large btn-default" href="http://owncloud.org/sync-clients/#windows"><i class="fa fa-windows"></i> Windows</a>
                    <a class="btn btn-large btn-default" href="http://owncloud.org/sync-clients/#mac"><i class="fa fa-apple"></i> Mac OS X</a>
                    <a class="btn btn-large btn-default" href="http://owncloud.org/sync-clients/#linux"><i class="fa fa-linux"></i> Linux</a>
                    <a class="btn btn-large btn-default" href="https://play.google.com/store/apps/details?id=com.owncloud.android"><i class="fa fa-android"></i> Android</a>
                    <a class="btn btn-large btn-default" href="http://itunes.apple.com/us/app/owncloud/id543672169?ls=1&mt=8"><i class="fa fa-apple"></i> iPhone</a>
                </div>
            </div>

        </div>

        <br/>
        <br/>


<!--/container-->
</div>

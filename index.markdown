---
layout: default
title: Beagle
style: device
---

<div class="jumbotron">
    <div class="container">

        <h1>Build your own cloud storage</h1>

        <p>This guide will help you to get running your personal cloud storage in your home and share your files across your mobile and desktop devices.
           It's possible only because of various open source projects, e.g. <a class="btn btn-default" href="http://owncloud.org" >ownCloud</a> and many others.</p>
        <p>Feel free to <a class="btn btn-default" href="http://groups.google.com/group/syncloud">contact us</a> if you have any questions.</p>

    </div>
</div>

<div class="container">

        <div class="row">

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">Step 1: Get Hardware</span></h3>
                <img class="center-block img-responsive" src="images/beagle-400.jpg"/>

                <p>Buy <a class="btn btn-primary" href="http://beagleboard.org/Products/BeagleBone+Black"><span class="glyphicon glyphicon-hdd"></span> BeagleBone Black</a> and external usb disk (if you do not have one).
                </p>
            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">Step 2: Get Software</span></h3>

                <img class="center-block img-responsive" src="images/owncloud-400.png"/>

                <p>Download ownCloud image for BeagleBone Black<a class="btn btn-primary" href="https://github.com/syncloud/owncloud-setup/releases/download/v0.1/syncloud-beagleboneblack-v0.1.img.xz">
                    <span class="glyphicon glyphicon-download"></span> Image
                </a>
                </p>
            </div>

        </div>

        <div class="row">

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">Step 3: Mix</span></h3>
                <br>
                <p>Flash BeagleBone Black using micro SD card (2Gb or more):</p>

                <h5><span class="badge">1</span><span style="padding-left: 10pt">Uncompress image:</span></h5>
                <span style="padding-left: 25pt"></span><code>unxz syncloud.img.xz</code>

                <h5><span class="badge">2</span><span style="padding-left: 10pt">Copy image to sd card</span></h5>
                <span style="padding-left: 25pt"></span><code>sudo dd if=./syncloud.img of=/dev/mmcblk0</code>

                <h5><span class="badge">3</span><span style="padding-left: 10pt">power off (by taking power cable out)</span></h5>
                <h5><span class="badge">4</span><span style="padding-left: 10pt">insert SD card into device</span></h5>
                <h5><span class="badge">5</span><span style="padding-left: 10pt">power on while holding user button</span></h5>
                <h5><span class="badge">6</span><span style="padding-left: 10pt">wait until all LEDs are steady on (may take ~20 minutes)</span></h5>
                <h5><span class="badge">7</span><span style="padding-left: 10pt">power off</span></h5>
                <h5><span class="badge">8</span><span style="padding-left: 10pt">remove sd card</span></h5>
                <h5><span class="badge">9</span><span style="padding-left: 10pt">attach hard drive (with one empty ext4 partition)</span></h5>

            </div>

            <div class="col-6 col-md-6 col-sm-6 col-lg-6">
                <h3><span class="label label-success">Step 4: Attach to your home network</span></h3>
                <br>
                <p>Now you are ready to connect the device. Use one of the available Ethernet sockets on your home router to connect the device as this considered a better approach than connecting using WiFi</p>
                <p>After that just turn it ON by inserting power cable</p>

                <img class="center-block img-responsive" src="images/beagle-setup.png"/>

            </div>

            <div class="col-12 col-md-12 col-sm-12 col-lg-12">
                <h3><span class="label label-success">Step 5: Locate your cloud address</span></h3>
                <br>
                <p>Using Bonjour Browser</p>

                <img class="center-block img-responsive" src="images/bonjour.png"/>
                <p></p>
                <p>You should find IP of your local ownCloud and navigate to the following url to finish setup and set your login and password</p>
                <code>http://[ip address]/owncloud</code>
                <p></p>
                <p>Download Bonjour:</p>
                <div class="btn-group">
                    <a class="btn btn-large btn-primary" href="http://hobbyistsoftware.com/Downloads/BonjourBrowser/BonjourBrowserSetup.exe"><i
                            class="fa fa-windows"></i> Windows</a>
                    <a class="btn btn-large btn-primary" href="http://www.tildesoft.com/files/BonjourBrowser.dmg"><i
                            class="fa fa-apple"></i> Mac OS X</a>
                    <a class="btn btn-large btn-primary" href="https://apps.ubuntu.com/cat/applications/avahi-discover"><i
                            class="fa fa-linux"></i> Linux</a>
                    <a class="btn btn-large btn-primary" href="https://play.google.com/store/apps/details?id=com.grokkt.android.bonjour"><i
                            class="fa fa-android"></i> Android</a>
                    <a class="btn btn-large btn-primary"
                       href="https://itunes.apple.com/gb/app/discovery-bonjour-browser/id305441017"><i class="fa fa-apple"></i>
                        iPhone</a>
                </div>
            </div>

        </div>

        <div class="row">

            <div class="col-12 col-md-12 col-sm-12 col-lg-12">
                <h3><span class="label label-success">Step 6: Create an account</span></h3>
                <br>

                <p>You should create your account to start using your cloud by entering url found in previous step to browser</p>

                <p></p>
                <div class="row">
                    <div class="col-md-12">
                        <img class="center-block img-responsive" src="images/owncloud-finish-setup.png">
                    </div>
                </div>

            </div>

        </div>

        <div class="row">

            <div class="col-12 col-md-12 col-sm-12 col-lg-12">
                <h3><span class="label label-success">Step 7: Connect your devices</span></h3>
                <p></p>

                <p>Use the same url from the previous step to connect your devices, for example on Android, after installing app, go to Settings -> Manage Accounts -> Create Account:</p>

                <p></p>

                <img class="center-block img-responsive" src="images/android-owncloud.png">

                <p></p>
                <p>Download apps</p>
                <div class="btn-group">
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#windows">
                        <i class="fa fa-windows"></i> Windows</a>
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#mac">
                        <i class="fa fa-apple"></i> Mac OS X</a>
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#linux">
                        <i class="fa fa-linux"></i> Linux</a>
                    <a class="btn btn-large btn-primary" href="https://play.google.com/store/apps/details?id=com.owncloud.android">
                        <i class="fa fa-android"></i> Android</a>
                    <a class="btn btn-large btn-primary" href="http://itunes.apple.com/us/app/owncloud/id543672169?ls=1&mt=8">
                        <i class="fa fa-apple"></i>iPhone</a>
                </div>
            </div>

        </div>

        <div class="row">

                    <div class="col-12 col-md-12 col-sm-12 col-lg-12">
                        <h3><span class="label label-success">Step 8: Use</span></h3>
                        <p></p>

                        <p>Now you are ready to share your files across your devices, just get the right app installed, as ownCloud creators say: Access. Sync. Share.</p>

                        <p></p>
                        <div class="row">
                            <div class="col-md-2"></div>
                            <div class="col-md-8">
                                <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                                    <!-- Indicators -->
                                    <ol class="carousel-indicators">
                                        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                                        <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                                        <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                                    </ol>

                                    <!-- Wrapper for slides -->
                                    <div class="carousel-inner">
                                        <div class="item active">
                                            <img src="images/use-owncloud-1.png">
                                        </div>
                                        <div class="item">
                                            <img src="images/use-owncloud-2.png">
                                        </div>
                                        <div class="item">
                                            <img src="images/use-owncloud-3.png">
                                        </div>
                                    </div>

                                    <!-- Controls -->
                                    <a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left"></span>
                                    </a>
                                    <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right"></span>
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-12"></div>

                        </div>

                        <p></p>
                        <a class="btn btn-default" href="http://owncloud.org/features/">Learn more</a> ownCloud features
                    </div>

                </div>

<!--/container-->
</div>

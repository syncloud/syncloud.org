---
layout: default
title: Get It
---

<div class="container_12">

    <div id="build" class="row">

        <div class="col-12">
            <!--<p class="pull-right visible-xs">
              <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
            </p>-->
            <div class="jumbotron">
                <h3>Build your cloud in several simple steps using open source tools</h3>

                <p>This guide will help you get running your personal cloud (based on <a href="http://owncloud.org">Owncloud</a>)
                    storage in your home and share your files across your mobile and desktop devices</p>
            </div>
            <div class="row padding">

                <div class="col-10 col-sm-12 col-lg-12">
                    <h3>Step 1: Get Hardware</h3>
                    <hr/>
                </div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Cloud with external disk</h4>

                    <p>Buy <a href="http://beagleboard.org/Products/BeagleBone+Black">Beagle Bone Black</a> and
                        external usb disk (if you do not have one)
                    </p>

                </div>

                <div class="col-2 col-sm-2 col-lg-2 text-center"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Cloud with internal disk</h4>

                    <p>Buy <a href="http://cubieboard.org/">Cubie Board</a> and internal SATA disk
                        (if you do not have one)</p>

                </div>

                <div class="col-12 col-sm-12 col-lg-12">
                    <h3>Step 2: Get Software</h3>
                    <hr/>
                </div>
                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Owncloud for beagle</h4>

                    <p>Download image <a
                            href="http://cyberb.mooo.com:10000/owncloud/public.php?service=files&t=334dbb442305833acae1b9bffe58d9d8&download">syncloud-beagle-0.0.2.img.xz</a>
                    </p>

                </div>

                <div class="col-2 col-sm-2 col-lg-2 text-center"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Owncloud for Cubie</h4>

                    <p>Download the image
                    </p>

                </div>


                <div class="col-12 col-sm-12 col-lg-12">
                    <h3>Step 3: Mix</h3>
                    <hr/>
                </div>
                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Flash Beagle using micro sd card (2Gb or more)</h4>

                    <ol>
                        <li>
                            <p>Uncompress image:</p>
                            <code>unxz syncloud-beagle-0.0.1.img.xz</code>

                            <p></p>
                        </li>
                        <li>
                            <p>Copy image to sd card, assuming it is /dev/mmcblk0 on your machine (may take ~20
                                minutes):</p>
                            <code>sudo dd if=./syncloud-beagle-0.0.2.img.xz of=/dev/mmcblk0</code>

                            <p></p>
                        </li>
                        <li>
                            <p>power OFF beagle</p>
                        </li>
                        <li>
                            <p>insert sd card into device</p>
                        </li>
                        <li>
                            <p>power ON while holding USER button</p>
                        </li>
                        <li>
                            <p>wait until all LEDs are steady ON</p>
                        </li>
                        <li>
                            <p>power OFF</p>
                        </li>
                        <li>
                            <p>remove card</p>
                        </li>
                        <li>
                            <p>power ON</p>
                        </li>
                    </ol>

                    <!--<p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>-->
                </div>

                <div class="col-2 col-sm-2 col-lg-2 text-center"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Flash Cubie</h4>

                    <p>Copy image to sdcard and insert it into device</p>

                    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                </div>
            </div>

            <div class="col-12 col-sm-12 col-lg-12">
                <h3>Step 4: Find Your cloud address</h3>
                <hr/>
            </div>
            <div class="col-12 col-sm-12 col-lg-12">
                <h4>Use avahi/bonjour browser</h4>

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
                
                <p>Locate under local -> Web Site -> Owncloud</p>
                <p>You should find IP of your local owncloud and navigate to the following url</p>
                <code>http://[ip address]/owncloud</code>
            </div>

            <div class="col-12 col-sm-12 col-lg-12">
                <h3>Step 5: Use</h3>
                <hr/>
            </div>
            <div class="col-12 col-sm-12 col-lg-12">
                <h4>Download clients</h4>

                <div class="btn-group">
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#windows"><i
                            class="fa fa-windows"></i> Windows</a>
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#mac"><i
                            class="fa fa-apple"></i> Mac OS X</a>
                    <a class="btn btn-large btn-primary" href="http://owncloud.org/sync-clients/#linux"><i
                            class="fa fa-linux"></i> Linux</a>
                    <a class="btn btn-large btn-primary"
                       href="https://play.google.com/store/apps/details?id=com.owncloud.android"><i
                            class="fa fa-android"></i> Android</a>
                    <a class="btn btn-large btn-primary"
                       href="http://itunes.apple.com/us/app/owncloud/id543672169?ls=1&mt=8"><i class="fa fa-apple"></i>
                        iPhone</a>
                </div>
            </div>


            <!--/row-->
        </div>

    </div>

    <br/>

    <div id="why" class="row">

        <div class="col-12">
            <!--<p class="pull-right visible-xs">
              <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
            </p>-->
            <div class="jumbotron">
                <h3>Why anyone might want to have personal cloud storage?</h3>

                <p>Because it is mine and I control it.</p>
            </div>

            <div class="col-12 col-sm-12 col-lg-12">
                <h4>Some other reasons just in case it is not enough</h4>

                <ol>
                    <li>Cheaper storage</li>
                    <li>No monthly subscriptions</li>
                    <li>No third party control</li>
                </ol>
            </div>

            <div class="col-12 col-sm-12 col-lg-12">
                <h4>Some concerns about personal device you should be aware of</h4>

                <ol>
                    <li>Backup currently is not implemented</li>
                </ol>
            </div>

            <!--/row-->
        </div>

    </div>
</div>

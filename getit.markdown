---
layout: default
title: Get It
---

<div class="container_12">

    <div class="row">

        <div class="col-12">
            <!--<p class="pull-right visible-xs">
              <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
            </p>-->
            <div class="jumbotron">
                <h3>Build your cloud in 3 steps</h3>

                <p>This guide will help you get running your personal cloud storage in your home and share your files
                    across your mobile and desktop devices</p>
            </div>
            <div class="row el">

                <div class="col-10 col-sm-12 col-lg-12">
                    <h3>Step 1: Get Hardware</h3>
                </div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Cloud with external disk</h4>

                    <p>Buy <a href="http://beagleboard.org/Products/BeagleBone+Black">Beagle Bone Black</a> and
                        external usb disk (if you do not have one)
                    </p>

                </div>

                <div class="col-2 col-sm-2 col-lg-2"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Cloud with internal disk</h4>

                    <p>Buy <a href="http://cubieboard.org/">Cubie Board</a> and internal SATA disk
                        (if you do not have one)</p>

                </div>

                <div class="col-12 col-sm-12 col-lg-12">
                    <h3>Step 2: Get Software</h3>
                </div>
                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Owncloud for beagle</h4>

                    <p>Download the image <a href="http://cyberb.mooo.com:10000/owncloud/public.php?service=files&t=4cb77b90a8ba23d9595ba15b7c0c4922&download">Beagle Owncloud</a>
                    </p>

                </div>

                <div class="col-2 col-sm-2 col-lg-2"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Owncloud for Cubie</h4>

                    <p>Download the image
                    </p>

                </div>


                <div class="col-12 col-sm-12 col-lg-12">
                    <h3>Step 3: Mix</h3>
                </div>
                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Flash Beagle using micro sd card (2Gb or more)</h4>

                    <ol class="numbered_list">
                        <li>
                            <p>Uncompress image:</p>
                            <code>unxz beagle-bone-black-owncloud-0.0.1.img.xz</code>
                            <p></p>
                        </li>
                        <li>
                            <p>Copy image to sd card, assuming it is /dev/mmcblk0 on your machine (may take ~20 minutes):</p>
                            <code>sudo dd if=./unxz beagle-bone-black-owncloud-0.0.1.img of=/dev/mmcblk0</code>
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

                    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                </div>

                <div class="col-2 col-sm-2 col-lg-2"><h4>or</h4></div>

                <div class="col-5 col-sm-5 col-lg-5">
                    <h4>Flash Cubie</h4>

                    <p>Copy image to sdcard and insert it into device</p>

                    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                </div>
            </div>
            <!--/row-->
        </div>
        <!--/span-->

        <!--<div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar" role="navigation">
          <div class="list-group">
            <a href="#" class="list-group-item active">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
            <a href="#" class="list-group-item">Link</a>
          </div>
        </div>--><!--/span-->
    </div>

</div>
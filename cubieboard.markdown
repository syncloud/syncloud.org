---
layout: device
title: cubieboard

boardname: cubieboard
releaseversion: v0.1
imagefile: syncloud-cubieboard1-v0.1.img
---

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">1. Get Hardware</span></h3>
        <img class="center-block img-responsive" src="images/board-cubieboard.png"/>

        <p>Buy <a href="http://cubieboard.org/buy">cubieboard A10</a> single-board computer and SATA hard drive.
        </p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">2. Get Software</span></h3>

        <img class="center-block img-responsive" src="images/software-lubuntu.png"/>

        <p>Download syncloud image for <a onClick="_gaq.push(['_trackEvent', 'Images', 'Download', '{{page.boardname}} {{page.releaseversion}}']);" href="https://github.com/syncloud/owncloud-setup/releases/download/{{page.releaseversion}}/{{page.imagefile}}.xz">{{page.boardname}}</a>.
        </p>
    </div>

</div>

<div class="row">

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">3. Install Software</span></h3>
        <br>
        <p>Flash cubieboard using USB On-The-Go port:</p>
        <div>
            <p><span class="badge">1</span><span style="padding-left: 10pt">Uncompress image file:</span></p>
            <p><span style="padding-left: 25pt"></span><code>unxz {{page.imagefile}}.xz</code></p>

            <p><span class="badge">2</span><span style="padding-left: 10pt">Install <a href="http://docs.cubieboard.org/tutorials/common/livesuit_installation_guide">LiveSuit or PhoenixSuit</a> depending on your platform</span></p>
            <p><span class="badge">3</span><span style="padding-left: 10pt">Open LiveSuit or PhoenixSuit and select {{page.imagefile}}.</span></p>
            <p><span class="badge">4</span><span style="padding-left: 10pt">Press FEL button on the board and do not release it.</span></p>
            <p><span class="badge">5</span><span style="padding-left: 10pt">Connect cubieboard to computer through USB On-The-Go port.</span></p>
            <p><span class="badge">6</span><span style="padding-left: 10pt">Flashing cubieboard should start automatically you can release FEL button.</span></p>
            <p><span class="badge">7</span><span style="padding-left: 10pt">When cubieboard start blinking all lights power it off.</span></p>
        </div>
        <p><a href="http://docs.cubieboard.org/tutorials/cb1/installation/cb1_lubuntu_nand_install">Read more</a> about LiveSuit and PhoenixSuit tools.</p>
    </div>

    <div class="col-6 col-md-6 col-sm-6 col-lg-6">
        <h3><span class="label label-success">4. Connect Everything</span></h3>
        <br>
        <img class="center-block img-responsive" src="images/schema-cubieboard-logo.png" style="max-width: 80%; margin: 0 auto"/>
    </div>

</div>

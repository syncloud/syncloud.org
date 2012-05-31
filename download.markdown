---
layout: default
title: Download
---
        
<script type="text/javascript">
    $(function(){

        // Tabs
        $('#tabs').tabs();
        if ($.client.os == "Windows") {
            $('#tabs').tabs( "select" , "#tabs-win" )
        } else if ($.client.os == "") {
            $('#tabs').tabs( "select" , "#tabs-mac" )
        } else if ($.client.os == "Linux") {
            $('#tabs').tabs( "select" , "#tabs-mac" )
        }

        //hover states on the static widgets
        $('#dialog_link, ul#icons li').hover(
                function() { $(this).addClass('ui-state-hover'); },
                function() { $(this).removeClass('ui-state-hover'); }
        );


    });
</script>

<div class="container_12">
    <!--
    <div class="grid_12">
        <div id="tabs">
            <ul>
                <li><a href="#tabs-win">Windows</a></li>
                <li><a href="#tabs-mac">Mac</a></li>
                <li><a href="#tabs-lin">Linux</a></li>
            </ul>
            <div id="tabs-win"><a href="#">Download</a></div>
            <div id="tabs-mac"><a href="#">Download</a></div>
            <div id="tabs-lin"><a href="#">Download</a></div>
        </div>
    </div>-->
</div>


---
layout: default
title: News
---

<div class="container_12">

    <p>&nbsp;</p>

    <!--<div class="grid_1">&nbsp;</div>-->
    <div class="grid_12" style="height: 500px">
        <div class="list-module">
            <h2>News</h2>
            <div class="list-body">
                <ul>
                    {% for post in site.posts reversed %}
                    <li>
                        <a href="{{ post.url }}">
                            <h3>{{ post.title }}</h3>
                            <p>{{ post.description }}</p>
                        </a>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>

</div>
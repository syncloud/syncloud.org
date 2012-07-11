---
layout: default
title: News
---

<div class="container_12">

    <div class="grid_1">&nbsp;</div>

    <div class="grid_10">
        <h3>News</h3>
        <br/>
        <div class="list-module">
            <div class="list-body">
                <ul>
                    {% for post in site.posts %}
                    <li>
                        <a href="{{ post.url }}">
                            <p style="float: right;">{{ post.date| date:"%b %d, %Y"}}</p>
                            <h3>{{ post.title }}</h3>
                            <p>{{ post.description }}</p>
                        </a>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>

    <div class="grid_1">&nbsp;</div>

</div>
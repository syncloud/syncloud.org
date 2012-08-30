---
layout: default
title: News
---

<div class="container_12">
    <div class="grid_12">

        {% for post in site.posts limit:1 %}
        <div class="news">
            <p style="float: right;">{{ post.date| date:"%b %d, %Y"}}</p>
            <h3>{{ post.title }}</h3>
            <br/>
            {{ post.content }}
        </div>
        {% endfor %}

        <br/>

        <h5>Other News</h5>
        <div class="list-module">
            <div class="list-body">
                <ul>
                    {% for post in site.posts offset:1 %}
                    <li>
                        <a href="{{ post.url }}">
                            <p style="float: right;">{{ post.date| date:"%b %d, %Y"}}</p>
                            <h6>{{ post.title }}</h6>
                            <p>{{ post.description }}</p>
                        </a>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>
</div>
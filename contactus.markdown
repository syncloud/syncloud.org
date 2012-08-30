---
layout: default
title: Contact Us
---

<script type="text/javascript">
    $(function(){
        $( "#submit_button" ).button({
            icons: {
                primary: "ui-icon-arrowthickstop-1-s"
            }
        });
    });
</script>

<div class="container_12">
    <div class="grid_12">
        <h3>Contact Us</h3>
        <br/>

        <p>You are welcome to leave your feedback, report a bug or just ask for a help with Syncloud software. Please fill out the form below. You also can e-mail to our distribution list <a href="mailto:syncloud@googlegroups.com">syncloud@googlegroups.com</a>.</p>
        <br/>

        <div>
            <script type="text/javascript">
                var submitted=false;
            </script>

            <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;" onload="if(submitted) {window.location='gotfeedback.html';}"></iframe>

            <form method="post" target="hidden_iframe" onsubmit="submitted=true;" id="form-signup"
                  action="https://docs.google.com/spreadsheet/formResponse?formkey=dGVrQi05SjZydTlRX00teTlSR1hsRHc6MQ&amp;ifq">
                <div class="contuctus_form">
                    <div>
                        <label for="entry_0">Name:</label>
                        <input placeholder="John" type="text" name="entry.0.single" id="entry_0" required="required" />
                    </div>
                    <div>
                        <label for="entry_1">E-mail:</label>
                        <input placeholder="john@mail.com" type="text" name="entry.1.single" id="entry_1" required="required" />
                    </div>
                    <div class="big_field">
                        <label for="entry_2">Message:</label>
                        <textarea placeholder="John's message" name="entry.2.single" rows="10" cols="80" id="entry_2" required="required"></textarea>
                    </div>
                    <div class="buttons">
                        <input type="submit" id="submit_button" name="submit" value="Submit" class="submit_button" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


<?php

function nullToEmpty($string, $emptyString = "")
{
    return (!is_null($string) && $string != "null" ) ? $string : $emptyString;
}

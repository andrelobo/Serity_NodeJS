
$("input.datai").change(function() { 
    $("input.dataf").attr({
        "min" : this.value,
     });
}); 

$("input.dataf").change(function() { 
    var coeff = 1000 * 60 * 10;
    var date = new Date(this.value);
    var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
    this.value = rounded.toISOString().slice(0,16);
    $("input.datai").attr({
        "max" : this.value,
     });
}); 
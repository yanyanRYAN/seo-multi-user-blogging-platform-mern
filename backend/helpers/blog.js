exports.smartTrim = (str, length, delim, appendix) => {
    //(the entire blog body, how many we chars we want to trim out, use an empty in the end,  ... + ' ' dots at the end)

    if( str.length <= length) return str;

    var trimmedStr = str.substr(0, length + delim.length )

    var lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if(lastDelimIndex => 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

    if(trimmedStr) trimmedStr += appendix;
    return trimmedStr;
}
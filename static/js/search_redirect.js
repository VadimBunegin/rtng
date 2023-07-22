function redirect(){
  let a = search.value;
  window.location.replace(search_url.value + '?title=' + a);
}

function review_redirect(){
  let a = review_search.value;
  window.location.replace(review_search_url.value + '?title=' + a);
}

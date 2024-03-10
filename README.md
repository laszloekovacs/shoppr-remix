https://dashvar.com/

implement email auth 
https://github.com/sergiodxa/remix-auth

## test stripe endpoint

forward calls to webhook, get a secret key
```
stripe listen --forward-to localhost:3000/webhooks
```

trigger a successfull payment intent
```
stripe trigger checkout.session.completed
```

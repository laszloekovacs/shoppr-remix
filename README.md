https://dashvar.com/
https://tachyons.io/
https://www.npmjs.com/package/crypto-js

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


## TODOS:
- when querying, project the required fields
- use invariant and add more null, undefined checking
- more ErrorBoundaries
- proper headers
- more load indicators, disabling, streaming
- http headers

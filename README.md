# Lemonade Home Assignment

First of all, there are a lot of comment in the code explaining why I did what I did,
so be sure to check those out too.

## Framework
I chose nodejs because of my experience with it and the fact that this application has 
a lot of IO and no complicated calculation of stuff like that, which node handles perfectly.

I was looking at this project: https://github.com/w3tecch/express-typescript-boilerplate but I never used it before,
and although it looks nice and very time efficient, I discovered I have to really understand what they use and 
how they use it. After reading a bit on the libraries they use I decided it was a bit too much.

I wanted to use this boilerplate for a couple of reasons:
- Typescript. I used typescript in the past but with Angular, not with node. I like the abilities this language
gives, with strong typing and everything else

- Swagger. I used swagger for a long time and it is just fantastic, the ability to expose the documentation for 
the api in such a simple way is amazing but the true amazing thing is to have it do the schema validation, 
and the routing. That way you always have a single source of truth which is also exposed to the api consumers.

- Logger. they use winstonjs for logging which is great.

The reason I didn't use it after all was because they use a log of things I never used before, like 
documenting the swagger using typescript, creating schemas, the TypeOrm library (which seems great but I 
have to see and understand it first) and typeDi which I didn't use.

So I decided to do it the old way and just start a simple nodejs server using express (for capabilities
and online support). 

In the past I used to create these Skeleton projects that contains Swagger, SwaggerUI, SwaggerValidation (etc...)
, errorHandling, logging and sometimes db connection. As I didn't have those here I just used some of my practices.
for example, I didn't use swagger, proper error handler and logger because if I were to implement them 
it would take me a long time.

## Structure
At the root level we have the `routes` `words` and `app.js`, `HttpError.js` directories and files.

The `routes` directory is where we store all of the routs to the app. Of course If 
I used swagger router this would be redundant.

The reason for me to do so is I wanted the logic of the application separated from 
http stuff. So if in the future there is a demand to use none-http methods It would still be simple 
to change.

The `words` directory has everything related to words. The repository 'adapter', the logic, and the errors (also models
if I created them)

## Business
Well the main idea behind the program was pretty clear to me, but the thing that was the hardest for me 
was the 'What happen if I fail?' question.

I thought of a couple of ways to handle this question:

- Saving the characters count I've already read from the stream and if I fail at some point, return them.
I decided to implement this method although I don't thing this is the best one. Before I started I didn't think
that there were two possibilities for failure: either something internal went wrong, which for that reason 
this solution is fine, or the connection interrupts, and then I can't return the 'count' above to the user 
(which I missed at the beginning)

- The second option was to write each stream into a temporary table (one of mySql features) and at the end 
combine it with our main table. The faults in this method is that if there is an error all of the work will go to waste,
which could be hours of streaming before a crash. That is why I don't like this solution too.


- The third solution (which I wished I've done) I to create another entity for each stream, and save the word count for each stream.
This way I have more control, meaning I can delete entire streams, know when the stream was and even save more data on the stream like
status for later use. Because of the control this method gives this would be the one I would use if I would rewrite my program.

## Tests
In the companies Iv'e worked before we did not write tests. However I know the importance of testing and 
this is one of the things I'm looking forward the most to learn in a new company
   
## Orm
As you can see in the code, the database queries are in the code and very strict, meaning changing them
will be painful. I should have used an ORM library.

## Statistics
The statistic route is within this service because at this point I don't think it's big enough to have its own
service. That would be another service to maintain. 

If in the future there will be a demand to expand the statistics functionality it might be best to separate
it to another service making one the "Gateway" service for the words and the other "Query" or "Statistics" service.

I decided to impalement a single endpoint for word count for the simplicity of it, but using something like 
graphql would give so much more than just word count. 

## Conclusion
This was indeed a very open tasks which raised some big questions, to some I did'nt choose the right answer. 

I probably forgot to write a lot of my thoughts but I feel like this won't end until I turn my work already :)

Thanks for the assignment, I haven't really write any code for about six month so that was refreshing!
     








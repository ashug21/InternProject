 -> Project is setup using Nextjs , Mongoose , Mongodb atlas , Express , Made minimal frontend 

 -> NOTE: Project is hosted on mongodb atlas as email : mixxtoo704@gmail.com
                                      pass : Harjap2009
      Made 2 collections named expenses and users


-> routes details frontend :
  Home -> Shows Homepage (/)
  Expense -> Lets User add expense , only if they are logged in (/expenses)
  Expense List -> Lets user see their added expenses  (/totalexpenses)
  Signup -> signup user with name , email and monthlyBudget , (/singup)
  Login -> login user with only email (this will create JWT) 


  -> routes details backend : 

  1) /api/users  -> To add a user (POST)
  2) /api/users/:id  -> Get user details (GET)
  3) /api/expenses   -> To add an expense (POST)
  4) /api/users/id/expenses (GET) -> Use mongodb atlas id to get the details
  5) /api/users/id/summary (GET)  -> Use mongodb atlas id to get the details


to check preload dataset
login using email -> Dhruv@gmail.com in (project login)

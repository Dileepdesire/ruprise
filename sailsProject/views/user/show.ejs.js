<div class="container">
	<h1><%- user.name %> </h1>
	<h3><%- user.title %> </h3>
	<hr>
	<h3>Contact : <%- user.email %> </h3>

	<a href="/user/edit/"<%= user.id %> class="btn btn-medium btn-primary"> Edit </a>

</div>
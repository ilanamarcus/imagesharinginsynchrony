$(document).ready( function () {
    var table = $('#image-table').DataTable( {
    	"ajax": "/receive/images"    
    });
    
    setInterval( function () {
    	table.ajax.reload( null, false ); // user paging is not reset on reload
	}, 10000 );
});



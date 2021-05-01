// CART SCRIPT
$(document).ready(function() {
	let itemDataDefault = { 
		id: 0,
		name: 'Лосьон-Спрей Доктора Плетнева Для Кожи И Волос Ночной С Ароматом Ванили', 
		volume: 100, 
		price: 1000,
		vendor_code: 0,
		count: 1 
	}

	function redrawCart(items) {
		let block = $('#cart-modal')
		let html = `Корзина пустая`
		const currentCart = JSON.parse(localStorage.getItem('cart'))

		if(currentCart && currentCart.length) {
			for(let i = 0; i < currentCart.length; i++) {
				const itemData = currentCart[i]

				html += `
					<div class="product-card-box-cart">
      			<div class="row align-items-center justify-content-center" id="cartItem_${i}">
      				<div class="col-lg-11">
      					<div class="row align-items-start">
      						<div class="col-xl-8 col-lg-8 col-md-12">
	        					<div class="info-product-box">
	        						<div class="box-img-info">
	        							<img src="assets/img/product/modal-products-open/prod-modal-1.png" alt="modal-cart-product-1">
	        						</div>
			        				<div class="info-box-product-card noselect">
			        					<div class="header-info-product">
			        						<h5>Лосьон-Спрей Доктора Плетнева Для Кожи И Волос Ночной С Ароматом Ванили</h5>
			        					</div>
			        					<div class="desc-product-modal">
			        						<p>объем мл</p>
			        						<p>в наличии</p>
			        					</div>
			        					<div class="modal-price-box">
			        						<p>цена</p>
			        					</div>
			        				</div>
	        					</div>
        					</div>
		        			<div class="col-xl-2 col-lg-2 col-md-4">
		        				<div class="counter-modal-box text-center noselect">
			        				<p>Колличество</p>
			        				<div class="number">
										<span class="minus"><img src="assets/img/icons/arrow-left.svg" class="cart-counter" alt="minus-icon"></span>
										<input class="input_count" type="text" value="${itemData?.count}">
										<span class="plus"><img src="assets/img/icons/arrow-right.svg" class="cart-counter" alt="plus-icon"></span>
									</div>
								</div>
		        			</div>
		        			<div class="col-xl-2 col-lg-2 col-md-4">
		        				<div class="end-price-box text-center noselect">
			        				<p class="mb-15">Сумма</p>
			        				<p class="modal-price">${itemData?.price} руб</p>
		        				</div>
		        			</div>
		        			<div class="delete-adaptive-btn col-xl-1 col-lg-1 col-md-4">
			        			<button type="button" class="delete-btn-cart">
			        				<img src="assets/img/icons/delete-icon.png" alt="delete-icon">
			        			</button>
	        				</div>
      					</div>
      				</div>
	        		<div class="delete-adaptive-btn-first col-xl-1 col-lg-1 col-md-2">
	        			<button type="button" class="delete-btn-cart">
	        				<img src="assets/img/icons/delete-icon.png" alt="delete-icon">
	        			</button>
	        		</div>
      			</div>
      		</div>

      		<hr>
				`
			}
		}

		block.html(html)
		updatePrice()
	}

	function addToCard(itemData) {
		const currentCart = JSON.parse(localStorage.getItem('cart'))

		if(currentCart && currentCart.length) {
			itemData.id = currentCart[currentCart.length - 1].id + 1

			const items = [...currentCart, itemData]

			localStorage.setItem('cart', JSON.stringify(items))

			redrawCart(items)
		} else {
			localStorage.setItem('cart', JSON.stringify([itemData]))
			redrawCart()
		}
	}

	function removeFromCard(id) {
		const currentCart = JSON.parse(localStorage.getItem('cart'))
		id = id.slice(-1)

		if(currentCart) {
			if(currentCart.length === 1) {
				localStorage.setItem('cart', JSON.stringify([])) 
			} else {
				currentCart.splice(id,1)
				localStorage.setItem('cart', JSON.stringify(currentCart))
			}
		}

		redrawCart()
	}

	function updatePrice(price) {
		const currentCart = JSON.parse(localStorage.getItem('cart'))
		const totalPrice = currentCart?.length && currentCart.map(i => i.count).reduce((total, item) => total + item) * 1000

		$('.price-count-p').text(`${price ? price : totalPrice} руб.`)
	}

	function updateCount(el, type = 'plus') {
		const $input = $(el).parent().find('input');
		const id = Number($(el).parent().parent().parent().parent().parent().parent().attr('id').slice(-1))
		let count

		if(type === 'plus') {
			count = parseInt($input.val()) + 1
		} else {
			count = parseInt($input.val()) - 1

			if(count < 1) {
				removeFromCard(`cardItem_${id}`)
				return
			}
		}

		$input.val(count);
		$input.change();
		const currentCart = JSON.parse(localStorage.getItem('cart'))

		currentCart.find(i => i.id === id).count = count
		localStorage.setItem('cart', JSON.stringify(currentCart))

		if(type === 'plus') {
			updatePrice()
		} else {
			let price
			price -= currentCart.find(i => i.id === id).count * 1000
			updatePrice(price)
		}

		return false;
	}


	$('.price-box button, .cart-btn').on('click', () => {
		let itemData = Object.assign({}, itemDataDefault)
		addToCard(itemData)
	});
	$(document).on('click', '.delete-btn-cart', function (e) {
		const id = $(this).parent().parent().attr('id')
		removeFromCard(id)
	});
	$(document).on('click', '.minus', function () {
		updateCount(this, 'minus')
	});

	$(document).on('click', '.plus', function () {
		updateCount(this, 'plus')
	});

	redrawCart()
});

// SEND CART
$('.send-btn').on('click', function() {
	const currentCart = localStorage.getItem('cart')
	const items = JSON.parse(currentCart)
	items.forEach(function(v){ delete v.id })

	const data = JSON.stringify({
		email: $('input[name=email]').val(),
		name: $('input[name=name]').val(),
		phone_number: $('input[name=phone]').val(),
		city: $('input[name=city]').val(),
		address: $('input[name=address]').val(),
		items
	})

	console.log(data)

	$.ajax({
		type: 'POST',
		url: 'https://email-form-pletnev.herokuapp.com/form',
		data,
		success() {
			document.getElementById("formOrder2").reset();
			$('#modal4').modal('hide');
			$("#successModal").modal('show');
		},
		error() {
			document.getElementById("formOrder2").reset();
			$('#modal4').modal('hide');
			$("#failedModal").modal('show');
		}
	})
})

$('.send-btn-about').on('click', function() {
	const data = JSON.stringify({
		email: $('input[name=email]').val(),
		name: $('input[name=name]').val(),
		phone_number: $('input[name=phone]').val(),
		city: $('input[name=city]').val(),
		address: $('input[name=address]').val(),
		items: [{ 
			name: 'Лосьон-Спрей Доктора Плетнева Для Кожи И Волос Ночной С Ароматом Ванили', 
			volume: 100, 
			price: 1000,
  			vendor_code: 0,
			count: 1 
		}]
	})

	$.ajax({
		type: 'POST',
		url: 'https://email-form-pletnev.herokuapp.com/form',
		data,
		success() {
			document.getElementById("formOrder").reset();
			$('#modal2').modal('hide');
			$("#successModal").modal('show');
		},
		error() {
			document.getElementById("formOrder").reset();
			$('#modal2').modal('hide');
			$("#failedModal").modal('show');
		}
	})
})

// FIELDS STORAGE
$(document).ready(function() {
	const currentFields = JSON.parse(localStorage.getItem('form'))
	const inputs = $('input')

	if(currentFields && inputs) {
		for(let i = 0; i < inputs.length; i++) {
			const input = inputs[i]
			const inputName = $(input).attr('name')

			$(input).attr('class') === 'form-control' && $(input).val(currentFields.find(i => i.field === inputName)?.value)
		}
	}

	$('input').on('blur', function() {
		const field = $(this).attr('name')
		const value = $(this).val()

		const currentFields = JSON.parse(localStorage.getItem('form'))
		const item = {
			field,
			value
		}

		if(currentFields) {
			const isCreated = currentFields.find(i => i.field === field)

			if(isCreated) {
				currentFields.find(i => i.field === field).value = value
				localStorage.setItem('form', JSON.stringify(currentFields))
				return
			}

			localStorage.setItem('form', JSON.stringify([...currentFields, item]))
		} else {
			localStorage.setItem('form', JSON.stringify([item]))
		}
	})
})

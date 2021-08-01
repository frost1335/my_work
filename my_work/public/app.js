const toCurrency = (price) => {
  return new Intl.NumberFormat("en-EN", {
    currency: "usd",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format.apply(new Date(date));
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

const $card = document.querySelector(".card_flex");

if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("card_remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf
      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      })
        .then((res) => res.json())
        .then((card) => {
          // console.log(card.houses);
          if (card.houses.length) {
            const html = card.houses
              .map((c) => {
                const priceT = c.price * c.count;
                return `
              <div class="row flex_card">
              <div class="col_1">
                <div class="swiper-container mySwiper content_swiper card_swiper">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide"><img src="${c.img_1}" alt="" /></div>
                    <div class="swiper-slide"><img src="${c.img_1}" alt="" /></div>
                    <div class="swiper-slide"><img src="${c.img_1}" alt="" /></div>
                  </div>
                  <div class="swiper-pagination"></div>
                </div>
                <p class="one_price">${c.price}</p>
              </div>
              <div class="col_2">
                <p class="content_text">${c.adress}</p>
                <p>rooms: <span class="content_text">${c.room}</span></p>
                <p>floor: <span class="content_text">${c.floor}</span></p>
              </div>
              <div class="col_3">
                <p class="content_text">houses: (<span>${c.count}</span>x)</p>
                <p class="total_price ">${priceT}</p>
              </div>
              <div class="col_4">
                <button
                  class="btn btn-small card_remove"
                  data-id="${c.id}"
                >Delete</button>
              </div>
            </div>
            <hr />
              `;
              })
              .join("");
            $card.querySelector(".box_cart").innerHTML = html;
            $card.querySelectorAll(".price").forEach((elem) => {
              elem.textContent = toCurrency(card.price);
            });
            $card.querySelectorAll(".one_price").forEach((elem) => {
              elem.textContent = toCurrency(elem.textContent);
            });
            $card.querySelectorAll(".total_price").forEach((elem) => {
              elem.textContent = toCurrency(elem.textContent);
            });
          } else {
            $card.innerHTML = "<p>Basket is empty</p>";
          }
        });
    }
  });
}
M.Tabs.init(document.querySelectorAll('.tabs'));
document.addEventListener('DOMContentLoaded', () => {
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');

    // CSRF 토큰 가져오기
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.itemId;
            const quantityTd = button.closest('tr').querySelector('.quantity');
            let currentQuantity = parseInt(quantityTd.textContent);

            if (currentQuantity > 0) {
                currentQuantity--;
                quantityTd.textContent = currentQuantity;

                // AJAX 요청 보내기 (수량 감소)
                fetch(`/decrease_quantity/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken 
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (!data.success) {
                            alert(data.message || '수량 변경에 실패했습니다.');
                            currentQuantity++; 
                            quantityTd.textContent = currentQuantity;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('수량 변경 중 오류가 발생했습니다.');
                        currentQuantity++; 
                        quantityTd.textContent = currentQuantity;
                    });
            }
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.itemId;
            const quantityTd = button.closest('tr').querySelector('.quantity');
            let currentQuantity = parseInt(quantityTd.textContent);

            currentQuantity++;
            quantityTd.textContent = currentQuantity;

            // AJAX 요청 보내기 (수량 증가)
            fetch(`/increase_quantity/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken 
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert(data.message || '수량 변경에 실패했습니다.');
                        currentQuantity--; 
                        quantityTd.textContent = currentQuantity;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('수량 변경 중 오류가 발생했습니다.');
                    currentQuantity--; 
                    quantityTd.textContent = currentQuantity;
                });
        });
    });
});
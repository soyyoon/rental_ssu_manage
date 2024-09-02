from flask import Flask, render_template, jsonify
from flask_mysqldb import MySQL
from config import Config
import MySQLdb.cursors
import traceback
import os
from flask_wtf.csrf import CSRFProtect
import secrets  # 비밀 키 생성을 위한 모듈

# Flask 앱 초기화
admin_app = Flask(__name__) 
admin_app.config.from_object(Config)

# 비밀 키 설정 (보안 강화를 위해 난수로 생성)
admin_app.config['SECRET_KEY'] = secrets.token_hex(16)  # 고유한 비밀 키 생성

# CSRF 보호 초기화
csrf = CSRFProtect(admin_app)

# MySQL 설정
admin_app.config['MYSQL_USER'] = 'root'
admin_app.config['MYSQL_PASSWORD'] = '1234'

mysql = MySQL(admin_app)

admin_app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# 라우트 및 기능 정의
@admin_app.route('/') 
def manage():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM items')
        items = cur.fetchall()
        cur.close()
        return render_template('manage.html', items=items) 

    except Exception as e:
        print(f"Error: {e}") 
        return "An error occurred."

@admin_app.route('/decrease_quantity/<int:item_id>', methods=['POST'])
def decrease_quantity(item_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('UPDATE items SET available_quantity = available_quantity - 1 WHERE id = %s AND available_quantity > 0', (item_id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@admin_app.route('/increase_quantity/<int:item_id>', methods=['POST'])
def increase_quantity(item_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute('UPDATE items SET available_quantity = available_quantity + 1 WHERE id = %s', (item_id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

# Flask 앱 실행
if __name__ == '__main__':
    admin_app.run(debug=True, port=5001)  # 다른 포트 번호 사용 (예: 5001)

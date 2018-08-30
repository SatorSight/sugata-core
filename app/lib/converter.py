from shutil import copyfile
import shutil
import random
import os
import sys
import re

HTML_DIR = './html/'
IMAGE_DIR = './images/'
FINAL_DIR = './converted/'

def get_all_image_links_in_html(html):
	links = re.findall('(src="(.*?)")', html)
	return links

def get_image_name_from_link(link):
	slash_pos = link.rfind('/')
	if slash_pos == -1:
		return False
	return link[slash_pos:].replace('/', '')

def get_new_link(link, issue_dir):
	start = link.find('/images')
	return link[start:].replace('/images', '/uploaded_images/' + issue_dir + '/images')

def random_char():
	lower_a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	upper_a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
	all_chars = lower_a + upper_a + num

	return random.choice(all_chars)

def get_free_name_in_path(path, initial_name):
	name = initial_name
	while os.path.isfile(path + name):
		name = random_char() + name
	return name

def replace_links_in_html_and_save(html_path, replacements):
	file = open(html_path, 'r+')
	contents = file.read()

	for replacement in replacements:
		contents = contents.replace(replacement['old_link'], replacement['new_link'])

	file.seek(0)
	file.write(contents)
	file.truncate()
	file.close()

def get_cover_path(issue_html_dir_contents, issue_html_dir):
	issue_html_dir_contents.sort()
	html_file = issue_html_dir_contents[0]
	html_path = HTML_DIR + issue_html_dir + '/' + html_file
	file = open(html_path)
	html = file.read()
	cover_link = re.findall('(src="(.*?)")', html)[0][1]
	file.close()
	return cover_link

def add_cover_to_output_dir(issue_html_dir_contents, issue_html_dir):
	cover_path = get_cover_path(issue_html_dir_contents, issue_html_dir)
	if os.path.isfile('.' + cover_path):
    	copyfile('.' + cover_path, FINAL_DIR + issue_html_dir + '/cover.jpg')

def make_zip_archive(issue_html_dir):
	zip_file_path = FINAL_DIR + issue_html_dir
	zip_file_full_path = zip_file_path + '.zip'

	if os.path.isfile(zip_file_full_path):
		os.remove(zip_file_full_path)

 	shutil.make_archive(zip_file_path, 'zip', FINAL_DIR + issue_html_dir)

	if os.path.isfile(zip_file_path):
		os.remove(zip_file_path)

 	shutil.move(zip_file_full_path, zip_file_path)

def clear_issue_dir(issue_html_dir):
	contents = os.listdir(FINAL_DIR + issue_html_dir)
	for content in contents:
		if os.path.isdir(FINAL_DIR + issue_html_dir + '/' + content):
			shutil.rmtree(FINAL_DIR + issue_html_dir + '/' + content)
def copy_images_to_dir(html_links, final_page_dir, file_contents):
	for link in html_links:
		link = link[1]
		image_name = get_image_name_from_link(link)
		final_name = get_free_name_in_path(final_page_dir, image_name)

		new_image_path = final_page_dir + final_name

		if os.path.isfile('.' + link):
			copyfile('.' + link, new_image_path)

			if not file_contents:
				print(final_page_dir)
				print('empty')


			file_contents = file_contents.replace(link, new_image_path)
	return file_contents

def zip_converted_dir():
	shutil.make_archive('converted', 'zip', './converted')

def create_and_fill_page_folders(issue_html_dir_contents, issue_html_dir):
	counter = 1
	for html_file_path in issue_html_dir_contents:

		final_issue_dir = FINAL_DIR + issue_html_dir + '/'
		final_page_dir = final_issue_dir + str(counter) + '/'

		if not os.path.exists(final_issue_dir):
			os.makedirs(final_issue_dir)
		if not os.path.exists(final_page_dir):
			os.makedirs(final_page_dir)

		html_path = HTML_DIR + issue_html_dir + '/' + html_file_path

		if not os.path.exists(html_path):
			print('not ex')

		html_file = open(html_path)
		html_file_contents = html_file.read()

		html_links = get_all_image_links_in_html(html_file_contents)
		html_file.close()

		new_html_path = final_page_dir + str(counter) + '.html'
		copyfile(html_path, new_html_path)
		new_html_file = open(new_html_path, 'r+')

		new_html_file_contents = new_html_file.read()
		if not new_html_file_contents:
			print(new_html_file)
			sys.exit()

		# new_html_file_contents = new_html_file.read()

		new_contents = copy_images_to_dir(html_links, final_page_dir, new_html_file_contents)

		new_html_file.seek(0)
		new_html_file.write(new_contents)
		new_html_file.truncate()

		new_html_file.close()
		counter += 1

if os.path.exists(FINAL_DIR):
	shutil.rmtree(FINAL_DIR)
if not os.path.exists(FINAL_DIR):
	os.makedirs(FINAL_DIR)

images_dir_contents = os.listdir(IMAGE_DIR)
html_dir_contents = os.listdir(HTML_DIR)

for issue_html_dir in html_dir_contents:
	issue_html_dir_contents = os.listdir(HTML_DIR + issue_html_dir)

	issue_html_dir_contents.sort()

	create_and_fill_page_folders(issue_html_dir_contents, issue_html_dir)
	make_zip_archive(issue_html_dir)
	clear_issue_dir(issue_html_dir)
	add_cover_to_output_dir(issue_html_dir_contents, issue_html_dir)
	zip_converted_dir()

print('Done');
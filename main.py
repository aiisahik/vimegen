import httplib2
import jinja2
from google.appengine.api.memcache import Client
from google.appengine.ext import db
from google.appengine.api import users
import webapp2
import oauth2 as oauth
import time, os
import urlparse

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class FileModel(db.Model):
	blob = db.BlobProperty()



class MainPage(webapp2.RequestHandler):		

    def get(self):
		
		template_values = {'greetings': "hello"}
		template = jinja_environment.get_template('index.html')
  		#self.response.out.write('Time to build our app!')
  		self.response.out.write(template.render(template_values))


app = webapp2.WSGIApplication([
	('/', MainPage)],
    debug=True)
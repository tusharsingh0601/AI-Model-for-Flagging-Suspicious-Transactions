from django.contrib import admin
from .models import Transaction

# This class defines how the Admin panel looks
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    # These are the columns you will see in the list
    list_display = ('transaction_id', 'amount', 'location', 'is_fraud', 'timestamp')
    
    # This adds a filter sidebar on the right
    list_filter = ('is_fraud', 'timestamp')
    
    # This adds a search bar at the top
    search_fields = ('transaction_id', 'location')

# NOTE: Do NOT add admin.site.register(Transaction) below this.
# The @admin.register decorator above handles it!
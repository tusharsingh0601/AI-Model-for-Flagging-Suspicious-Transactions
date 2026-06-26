from django.db import models

class Transaction(models.Model):
    # This is the unique ID (e.g., "TXN-8842-A")
    transaction_id = models.CharField(max_length=50, unique=True)
    
    # The money amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Where it happened (e.g., "London, UK")
    location = models.CharField(max_length=100)
    
    # The AI's decision
    is_fraud = models.BooleanField(default=False)
    
    # When it happened (automatically set to "now")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_id} - ${self.amount}"